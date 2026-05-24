import { Avatar, AvatarFallback, AvatarImage } from "@suiteonix/ui";
import { Badge } from "@suiteonix/ui";
import { Item } from "@suiteonix/ui";
import { Skeleton } from "@suiteonix/ui";
import type { NixID } from "@suiteonix/server/models";
import type { OrganizationModel } from "@suiteonix/server";
import {OrganizationRequest} from "@suiteonix/server";
import {OrganizationQuickViewPopover} from "#/modules/organization/components/OrganizationQuickViewPopover.tsx";

function isSystemOrganizationId(id?: NixID) {
  return !id || id === "0";
}

function getInitials(name?: string, shortName?: string) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  const fromName = parts.slice(0, 2).map((part) => part[0]).join("");
  return (fromName || shortName?.slice(0, 2) || "OG").toUpperCase();
}

function SystemCell() {
  return (
    <Badge variant="secondary" className="font-medium">
      SYSTEM
    </Badge>
  );
}

function Cell1(props: { id: NixID }) {
  if (isSystemOrganizationId(props.id)) {
    return <SystemCell />;
  }

  const { data: org, isLoading, error } = OrganizationRequest.useGetOrganizationByID(
    props.id,
  );

  if (isLoading) {
    return <Skeleton className="h-8 w-36 rounded-lg" />;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return <Cell2 org={org} />;
}

function Cell2({ org }: { org?: OrganizationModel.Organization }) {
  if (!org) {
    return <Skeleton className="h-8 w-36 rounded-lg" />;
  }

  return (
    <Item
      variant="default"
      className="flex flex-row items-center gap-2 rounded-lg p-2"
    >
      <Avatar className="h-5 w-5 rounded-lg grayscale">
        <AvatarImage src={org.logo ?? undefined} alt={`${org.name}'s logo`} className="object-cover" />
        <AvatarFallback className="rounded-lg text-[10px]">
          {getInitials(org.name, org.shortName)}
        </AvatarFallback>
      </Avatar>
      <div className="truncate">{org.name || org.shortName || org.id}</div>
    </Item>
  );
}

function CellWithPopover(props: { id: NixID }) {
  if (isSystemOrganizationId(props.id)) {
    return <SystemCell />;
  }

  const { data: org, isLoading, error } = OrganizationRequest.useGetOrganizationByID(
    props.id,
  );

  if (isLoading) {
    return <Skeleton className="h-8 w-36 rounded-lg" />;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return <Cell2WithPopOver org={org} />;
}

function Cell2WithPopOver({ org }: { org?: OrganizationModel.Organization }) {
  if (!org) {
    return <Skeleton className="h-8 w-36 rounded-lg" />;
  }

  return (
    <OrganizationQuickViewPopover orgID={org.id}>
      <div className="cursor-pointer">
        <Cell2 org={org} />
      </div>
    </OrganizationQuickViewPopover>
  );
}

const OrgCell = {
  Cell1,
  Cell2,
  CellWithPopover,
  Cell2WithPopOver,
};

export default OrgCell;
