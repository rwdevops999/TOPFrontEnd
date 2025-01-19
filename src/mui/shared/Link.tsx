/**
 * @ignore - internal component.
 */

import { forwardRef, useMemo } from "react";

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  history?: "auto" | "push" | "replace";
}

export const Link = forwardRef(function Link(
  props: LinkProps,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  const { id, children, href, onClick, history, ...rest } = props;

  // const handleLinkClick = React.useMemo(() => {
  //   if (!routerContext) {
  //     return onClick;
  //   }
  //   return (event: React.MouseEvent<HTMLAnchorElement>) => {
  //     event.preventDefault();
  //     const url = new URL(event.currentTarget.href);
  //     routerContext.navigate(url.pathname, { history });
  //     onClick?.(event);
  //   };
  // }, [routerContext, onClick, history]);

  const handleLinkClick = () => {
    return (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      // const url = new URL(event.currentTarget.href);
      onClick?.(event);
    };
  };

  if (href) {
    return (
      <a ref={ref} href={href} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <a ref={ref} {...rest} onClick={() => handleLinkClick}>
      {children}
    </a>
  );
});
