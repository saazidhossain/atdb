import {
  Link as TLink,
  useNavigate as tUseNavigate,
  useParams as tUseParams,
  useLocation as tUseLocation,
} from "@tanstack/react-router";
import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";
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

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, replace, state: _state, end: _end, children, ...rest }, ref) => {
    return (
      // @ts-expect-error — relaxed typing for ported codebase
      <TLink ref={ref} to={to} replace={replace} {...rest}>
        {children}
      </TLink>
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
    return (
      // @ts-expect-error — relaxed typing
      <TLink
        ref={ref}
        to={to}
        {...rest}
        // @ts-expect-error — TanStack supports activeProps; we synthesize className
        children={(args: { isActive?: boolean }) => {
          const isActive = !!args?.isActive;
          const cls =
            typeof className === "function"
              ? className({ isActive, isPending: false })
              : className;
          return <span className={cn(cls)}>{children}</span>;
        }}
      />
    );
  },
);
NavLink.displayName = "NavLink";

export function useParams<T extends Record<string, string | undefined> = Record<string, string | undefined>>(): T {
  return tUseParams({ strict: false }) as T;
}

export function useLocation() {
  const loc = tUseLocation();
  return {
    pathname: loc.pathname,
    search: loc.searchStr,
    hash: loc.hash,
    state: loc.state,
    key: "default",
  };
}

export function useNavigate() {
  const nav = tUseNavigate();
  return (arg: string | number | { to?: string; replace?: boolean }) => {
    if (typeof arg === "number") {
      if (typeof window !== "undefined") window.history.go(arg);
      return;
    }
    if (typeof arg === "string") {
      // @ts-expect-error — relaxed
      nav({ to: arg });
      return;
    }
    // @ts-expect-error — relaxed
    nav(arg);
  };
}
