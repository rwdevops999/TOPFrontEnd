import {
  Avatar,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  styled,
} from "@mui/material";
import { Navigation } from "./AppProvider";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Fragment } from "react/jsx-runtime";
import { useCallback, useMemo, useState } from "react";
import {
  getItemTitle,
  getPageItemFullPath,
  hasSelectedNavigationChildren,
  isPageItemSelected,
} from "./shared/navigate";
import { Link } from "./shared/Link";

const NavigationListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: 8,
  "&.Mui-selected": {
    "& .MuiListItemIcon-root": {
      color: (theme.vars ?? theme).palette.primary.dark,
    },
    "& .MuiTypography-root": {
      color: (theme.vars ?? theme).palette.text.primary,
    },
    "& .MuiSvgIcon-root": {
      color: (theme.vars ?? theme).palette.primary.dark,
    },
    "& .MuiAvatar-root": {
      backgroundColor: (theme.vars ?? theme).palette.primary.dark,
    },
    "& .MuiTouchRipple-child": {
      backgroundColor: (theme.vars ?? theme).palette.primary.dark,
    },
  },
  "& .MuiSvgIcon-root": {
    color: (theme.vars ?? theme).palette.action.active,
  },
  "& .MuiAvatar-root": {
    backgroundColor: (theme.vars ?? theme).palette.action.active,
  },
}));

const DashboardSidebarSubNavigation = ({
  subNavigation,
  depth = 0,
  basePath = "",
  onLinkClick,
  selectedItemId,
}: {
  subNavigation: Navigation;
  depth: number;
  basePath: string;
  onLinkClick: (n: number, id: any) => void;
  selectedItemId: string;
}) => {
  const pathname = "/";

  const initialExpandedSidebarItemIds = useMemo(
    () =>
      subNavigation
        .map((navigationItem, navigationItemIndex) => ({
          navigationItem,
          originalIndex: navigationItemIndex,
        }))
        .filter(({ navigationItem }) =>
          hasSelectedNavigationChildren(navigationItem, basePath, pathname)
        )
        .map(({ originalIndex }) => `${depth}-${originalIndex}`),
    [basePath, depth, pathname, subNavigation]
  );

  const [expandedSidebarItemIds, setExpandedSidebarItemIds] = useState(
    initialExpandedSidebarItemIds
  );

  const handleOpenFolderClick = useCallback(
    (itemId: string) => () => {
      setExpandedSidebarItemIds((previousValue) =>
        previousValue.includes(itemId)
          ? previousValue.filter(
              (previousValueItemId) => previousValueItemId !== itemId
            )
          : [itemId]
      );
    },
    []
  );

  return (
    <List sx={{ padding: 0, mb: depth === 0 ? 4 : 1, pl: 2 * depth }}>
      {subNavigation.map((navigationItem, navigationItemIndex) => {
        if (navigationItem.kind === "header") {
          return (
            <ListSubheader
              key={`subheader-${depth}-${navigationItemIndex}`}
              component="div"
              sx={{
                fontSize: 12,
                fontWeight: "700",
                height: 40,
                px: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                zIndex: 2,
              }}
            >
              {getItemTitle(navigationItem)}
            </ListSubheader>
          );
        }

        if (navigationItem.kind === "divider") {
          const nextItem = subNavigation[navigationItemIndex + 1];

          return (
            <Divider
              key={`divider-${depth}-${navigationItemIndex}`}
              sx={{
                borderBottomWidth: 2,
                mx: 1,
                mt: 1,
                mb: nextItem?.kind === "header" ? 0 : 1,
              }}
            />
          );
        }

        const navigationItemFullPath = getPageItemFullPath(
          basePath,
          navigationItem
        );
        const navigationItemId = `${depth}-${navigationItemIndex}`;
        const navigationItemTitle = getItemTitle(navigationItem);

        const isNestedNavigationExpanded =
          expandedSidebarItemIds.includes(navigationItemId);

        const nestedNavigationCollapseIcon = isNestedNavigationExpanded ? (
          <ExpandLessIcon />
        ) : (
          <ExpandMoreIcon />
        );

        const listItemIconSize = 34;

        const isSelected = isPageItemSelected(
          navigationItem,
          basePath,
          pathname
        );

        if (isSelected && !selectedItemId) {
          selectedItemId = navigationItemId;
        }

        const listItem = (
          <ListItem
            sx={{
              py: 0,
              px: 1,
              overflowX: "hidden",
            }}
          >
            <NavigationListItemButton
              data-title={navigationItem.datatitle}
              selected={isSelected && !navigationItem.children}
              sx={{
                px: 1.4,
                height: 48,
              }}
              {...(navigationItem.children
                ? {
                    onClick: handleOpenFolderClick(navigationItemId),
                  }
                : {
                    LinkComponent: Link,
                    href: navigationItem.href,
                    onClick: () => onLinkClick(1, navigationItem.id),
                    id: navigationItem.id,
                  })}
            >
              {navigationItem.icon ? (
                <ListItemIcon
                  sx={{
                    minWidth: listItemIconSize,
                    mr: 1.2,
                  }}
                >
                  {navigationItem.icon ?? null}
                  {!navigationItem.icon ? (
                    <Avatar
                      sx={{
                        width: listItemIconSize - 7,
                        height: listItemIconSize - 7,
                        fontSize: 12,
                        ml: "-2px",
                      }}
                    >
                      {navigationItemTitle
                        .split(" ")
                        .slice(0, 2)
                        .map((itemTitleWord) =>
                          itemTitleWord.charAt(0).toUpperCase()
                        )}
                    </Avatar>
                  ) : null}
                </ListItemIcon>
              ) : null}
              <ListItemText
                primary={navigationItemTitle}
                sx={{
                  whiteSpace: "nowrap",
                  zIndex: 1,
                  "& .MuiTypography-root": {
                    fontWeight: "500",
                  },
                }}
              />
              {navigationItem.children ? nestedNavigationCollapseIcon : null}
            </NavigationListItemButton>
          </ListItem>
        );

        return (
          <Fragment key={navigationItemId}>
            {listItem}

            {navigationItem.children ? (
              <Collapse
                in={isNestedNavigationExpanded}
                timeout="auto"
                unmountOnExit
              >
                <DashboardSidebarSubNavigation
                  subNavigation={navigationItem.children}
                  basePath={navigationItemFullPath}
                  depth={depth + 1}
                  onLinkClick={onLinkClick}
                  selectedItemId={selectedItemId}
                />
              </Collapse>
            ) : null}
          </Fragment>
        );
      })}
    </List>
  );
};

export default DashboardSidebarSubNavigation;
