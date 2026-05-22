import type { ReactNode } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@suiteonix/ui";
import { Badge } from "@suiteonix/ui";
import { Item } from "@suiteonix/ui";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@suiteonix/ui";
import { Skeleton } from "@suiteonix/ui";
import type { NixID } from "@suiteonix/server/models";
import type { OrganizationModel } from "@suiteonix/server";
import {OrganizationRequest} from "@suiteonix/server";
import {
  BadgeCheck,
  Ban,
  BriefcaseBusiness,
  Building2,
  Hash,
} from "lucide-react";

function isSystemOrganizationId(id?: NixID) {
  return !id || id === "0";
}

function getInitials(name?: string, shortName?: string) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  const fromName = parts.slice(0, 2).map((part) => part[0]).join("");
  return (fromName || shortName?.slice(0, 2) || "OG").toUpperCase();
}

function OrgDetailRow({
  icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value?: ReactNode;
}) {
  const Icon = icon;

  return (
    <div className="flex items-start gap-3 rounded-md border bg-muted/30 px-3 py-2">
      <div className="mt-0.5 rounded-sm border bg-background p-1.5 text-muted-foreground">
        <Icon className="size-3.5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <div className="wrap-break-word text-sm text-foreground">
          {value || "Not provided"}
        </div>
      </div>
    </div>
  );
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
        <AvatarImage src={org.logo} alt={`${org.name}'s logo`} className="object-cover" />
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
    <Popover>
      <PopoverTrigger asChild>
        <div className="cursor-pointer">
          <Cell2 org={org} />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-96 space-y-4">
        <CellPopoverContent org={org} />
      </PopoverContent>
    </Popover>
  );
}

function CellPopoverContent({ org }: { org?: OrganizationModel.Organization }) {
  if (!org) {
    return <Skeleton className="h-24 w-full" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <Avatar className="size-16 rounded-xl border">
          <AvatarImage src={org.logo} alt={`${org.name}'s logo`} className="object-cover" />
          <AvatarFallback className="rounded-xl text-base">
            {getInitials(org.name, org.shortName)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1 space-y-1">
          <div>
            <p className="text-lg font-semibold leading-tight">
              {org.name || "Unknown organization"}
            </p>
            <p className="text-sm text-muted-foreground">Organization ID: {org.id}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {org.isApproved ? (
              <Badge variant="secondary">
                <BadgeCheck className="size-3.5" />
                Approved
              </Badge>
            ) : (
              <Badge variant="outline">Pending approval</Badge>
            )}
            {org.isSuspended ? (
              <Badge variant="destructive">
                <Ban className="size-3.5" />
                Suspended
              </Badge>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        <OrgDetailRow icon={Building2} label="Name" value={org.name} />
        <OrgDetailRow icon={BriefcaseBusiness} label="Short name" value={org.shortName} />
        <OrgDetailRow icon={BriefcaseBusiness} label="Industry" value={org.industry} />
        <OrgDetailRow icon={Hash} label="Entity ID" value={org.entityID} />
      </div>
    </div>
  );
}

const OrgCell = {
  Cell1,
  Cell2,
  CellWithPopover,
  Cell2WithPopOver,
};

export default OrgCell;
