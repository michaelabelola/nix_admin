import type {LeaseDefinitionModel} from "@/modules/real-estate/lease-definition/model.ts";
import type {PropertyFeatureModel} from "@/modules/real-estate/property-feature/model.ts";
import type {PropertyFeatureRuleModel} from "@/modules/real-estate/property-feature-rule/model.ts";
import type {PropertyModel} from "@/modules/real-estate/property/model.ts";
import type {RealEstatePricingModel} from "@/modules/real-estate/pricing/model.ts";
import type {RentDefinitionModel} from "@/modules/real-estate/rent-definition/model.ts";
import type {SpaceModel} from "@/modules/real-estate/space/model.ts";
import type {PageRequest} from "@/models/PagedModel.ts";

export namespace RealEstateQueryKeys {
    export const propertiesRoot = ['real-estate', 'properties'] as const
    export const property = (propertyId: PropertyModel.PropertyID) => [...propertiesRoot, propertyId] as const
    export const properties = (params?: PageRequest) => [...propertiesRoot, 'list', params] as const
    export const propertyRecord = (propertyId: PropertyModel.PropertyID) => [...property(propertyId), 'record'] as const
    export const propertyDetailed = (propertyId: PropertyModel.PropertyID) => [...property(propertyId), 'detailed'] as const
    export const propertyListingProfiles = (propertyId: PropertyModel.PropertyID) => [...property(propertyId), 'listing-profiles'] as const
    export const propertyListingProfile = (listingProfileId: string) => ['listing-profile', listingProfileId] as const
    export const propertyListingProfileDetailed = (listingProfileId: string) => [...propertyListingProfile(listingProfileId), 'detailed'] as const
    export const propertyFeatures = (propertyId: PropertyModel.PropertyID) => [...property(propertyId), 'features'] as const
    export const propertyFeature = (propertyId: PropertyModel.PropertyID, featureId: PropertyFeatureModel.PropertyFeatureID) => [...propertyFeatures(propertyId), featureId] as const
    export const propertyPricings = (propertyId: PropertyModel.PropertyID) => [...property(propertyId), 'pricings'] as const
    export const propertyPricing = (propertyId: PropertyModel.PropertyID, pricingId: RealEstatePricingModel.PriceID) => [...propertyPricings(propertyId), pricingId] as const
    export const propertyRents = (propertyId: PropertyModel.PropertyID) => [...property(propertyId), 'rents'] as const
    export const propertyRent = (propertyId: PropertyModel.PropertyID, rentDefinitionId: RentDefinitionModel.RentDefinitionID) => [...propertyRents(propertyId), rentDefinitionId] as const
    export const propertyLeases = (propertyId: PropertyModel.PropertyID) => [...property(propertyId), 'leases'] as const
    export const propertyLease = (propertyId: PropertyModel.PropertyID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID) => [...propertyLeases(propertyId), leaseDefinitionId] as const
    export const propertySpaces = (propertyId: PropertyModel.PropertyID, params?: PageRequest) => [...property(propertyId), 'spaces', 'list', params] as const
    export const propertyAssignedLocation = (propertyId: PropertyModel.PropertyID) => [...property(propertyId), 'location'] as const

    export const propertyLocationsRoot = ['real-estate', 'locations'] as const
    export const propertyLocations = (params?: PageRequest) => [...propertyLocationsRoot, 'list', params] as const
    export const propertyLocation = (locationId: PropertyModel.PropertyLocationID) => [...propertyLocationsRoot, locationId] as const

    export const featureRulesRoot = ['real-estate', 'feature-rules'] as const
    export const featureRules = (params?: PageRequest) => [...featureRulesRoot, 'list', params] as const
    export const featureRule = (featureRuleId: PropertyFeatureRuleModel.FeatureRuleID) => [...featureRulesRoot, featureRuleId] as const

    export const spaceTypesRoot = ['real-estate', 'space-types'] as const
    export const spaceTypes = (params?: PageRequest) => [...spaceTypesRoot, 'list', params] as const
    export const spaceType = (spaceTypeId: SpaceModel.SpaceTypeID) => [...spaceTypesRoot, spaceTypeId] as const

    export const spacesRoot = ['real-estate', 'spaces'] as const
    export const space = (spaceId: SpaceModel.SpaceID) => [...spacesRoot, spaceId] as const
    export const spaceDetailed = (spaceId: SpaceModel.SpaceID) => [...space(spaceId), 'detailed'] as const
    export const spacePricings = (spaceId: SpaceModel.SpaceID) => [...space(spaceId), 'pricings'] as const
    export const spacePricing = (spaceId: SpaceModel.SpaceID, pricingId: RealEstatePricingModel.PriceID) => [...spacePricings(spaceId), pricingId] as const
    export const spaceRents = (spaceId: SpaceModel.SpaceID) => [...space(spaceId), 'rents'] as const
    export const spaceRent = (spaceId: SpaceModel.SpaceID, rentDefinitionId: RentDefinitionModel.RentDefinitionID) => [...spaceRents(spaceId), rentDefinitionId] as const
    export const spaceLeases = (spaceId: SpaceModel.SpaceID) => [...space(spaceId), 'leases'] as const
    export const spaceLease = (spaceId: SpaceModel.SpaceID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID) => [...spaceLeases(spaceId), leaseDefinitionId] as const
}
