import {
  Link as TLink,
  useNavigate as tUseNavigate,
  useParams as tUseParams,
  useLocation as tUseLocation,
} from "@tanstack/react-router";
import { forwardRef, useMemo, type AnchorHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * react-router-dom compatibility shim over TanStack Router.
 * Lets us reuse code originally written for react-router-dom without
 * fighting TanStack's typed `to`/`params` API.
 */

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
  replace?: boolean;
  state?: unknown;
  end?: boolean;
  children?: ReactNode;
};

const TLinkAny = TLink as unknown as React.ComponentType<any>;

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, replace, state: _state, end: _end, children, ...rest }, ref) => {
    return (
      <TLinkAny ref={ref} to={to} replace={replace} {...rest}>
        {children}
      </TLinkAny>
    );
  },
);
Link.displayName = "Link";

type NavLinkProps = Omit<LinkProps, "className"> & {
  className?:
    | string
    | ((args: { isActive: boolean; isPending: boolean }) => string);
};

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ to, className, children, ...rest }, ref) => {
    const renderChild = (args: { isActive?: boolean }) => {
      const isActive = !!args?.isActive;
      const cls =
        typeof className === "function"
          ? className({ isActive, isPending: false })
          : className;
      return <span className={cn(cls)}>{children}</span>;
    };
    return (
      <TLinkAny ref={ref} to={to} {...rest}>
        {renderChild}
      </TLinkAny>
    );
  },
);
NavLink.displayName = "NavLink";

export function useParams<
  T extends Record<string, string | undefined> = Record<string, string | undefined>,
>(): T {
  return tUseParams({ strict: false }) as T;
}

export function useLocation() {
  const loc = tUseLocation();
  return useMemo(
    () => ({
      pathname: loc.pathname,
      search: loc.searchStr,
      hash: loc.hash,
      state: loc.state,
      key: "default",
    }),
    [loc.pathname, loc.searchStr, loc.hash, loc.state],
  );
}

type NavArg = string | number | { to?: string; replace?: boolean; search?: any; params?: any };

export function useNavigate() {
  const nav = tUseNavigate();
  return (arg: NavArg) => {
    if (typeof arg === "number") {
      if (typeof window !== "undefined") window.history.go(arg);
      return;
    }
    if (typeof arg === "string") {
      (nav as any)({ to: arg });
      return;
    }
    (nav as any)(arg);
  };
}
