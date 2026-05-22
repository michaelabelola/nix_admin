import type {LeaseDefinitionModel} from "./lease-definition/model.ts";
import type {PropertyFeatureModel} from "./property-feature/model.ts";
import type {PropertyFeatureRuleModel} from "./property-feature-rule/model.ts";
import type {PropertyModel} from "./property/model.ts";
import type {RealEstatePricingModel} from "./pricing/model.ts";
import type {RentDefinitionModel} from "./rent-definition/model.ts";
import type {PageRequest} from "@suiteonix/models";

export namespace RealEstateQueryKeys {
    export const propertiesRoot = ['real-estate', 'properties'] as const
    export const propertyListingProfilesRoot = [...propertiesRoot, 'listing-profiles'] as const
    export const property = (propertyId: PropertyModel.PropertyID) => [...propertiesRoot, propertyId] as const
    export const properties = (params?: PageRequest) => [...propertiesRoot, 'list', params] as const
    export const propertyRecord = (propertyId: PropertyModel.PropertyID) => [...property(propertyId), 'record'] as const
    export const propertyDetailed = (propertyId: PropertyModel.PropertyID) => [...property(propertyId), 'detailed'] as const
    export const propertyListingProfiles = (propertyId: PropertyModel.PropertyID) => [...property(propertyId), 'listing-profiles'] as const
    export const listingProfiles = (params?: PageRequest) => [...propertyListingProfilesRoot, 'list', params] as const
    export const propertyListingProfile = (listingProfileId: string) => ['listing-profile', listingProfileId] as const
    export const propertyListingProfileDetailed = (listingProfileId: string) => [...propertyListingProfile(listingProfileId), 'detailed'] as const
    export const propertyListingProfileListings = (listingProfileId: string) => [...propertyListingProfile(listingProfileId), 'listings'] as const
    export const propertyFeatures = (propertyId: PropertyModel.PropertyID) => [...property(propertyId), 'features'] as const
    export const propertyFeature = (propertyId: PropertyModel.PropertyID, featureId: PropertyFeatureModel.PropertyFeatureID) => [...propertyFeatures(propertyId), featureId] as const
    export const propertyPricings = (propertyId: PropertyModel.PropertyID) => [...property(propertyId), 'pricings'] as const
    export const propertyPricing = (propertyId: PropertyModel.PropertyID, pricingId: RealEstatePricingModel.PriceID) => [...propertyPricings(propertyId), pricingId] as const
    export const propertyRents = (propertyId: PropertyModel.PropertyID) => [...property(propertyId), 'rents'] as const
    export const propertyRent = (propertyId: PropertyModel.PropertyID, rentDefinitionId: RentDefinitionModel.RentDefinitionID) => [...propertyRents(propertyId), rentDefinitionId] as const
    export const propertyLeases = (propertyId: PropertyModel.PropertyID) => [...property(propertyId), 'leases'] as const
    export const propertyLease = (propertyId: PropertyModel.PropertyID, leaseDefinitionId: LeaseDefinitionModel.LeaseDefinitionID) => [...propertyLeases(propertyId), leaseDefinitionId] as const
    export const propertyAssignedLocation = (propertyId: PropertyModel.PropertyID) => [...property(propertyId), 'location'] as const

    export const propertyLocationsRoot = ['real-estate', 'locations'] as const
    export const propertyLocations = (params?: PageRequest) => [...propertyLocationsRoot, 'list', params] as const
    export const propertyLocation = (locationId: PropertyModel.PropertyLocationID) => [...propertyLocationsRoot, locationId] as const

    export const featureRulesRoot = ['real-estate', 'feature-rules'] as const
    export const featureRules = (params?: PageRequest) => [...featureRulesRoot, 'list', params] as const
    export const featureRule = (featureRuleId: PropertyFeatureRuleModel.FeatureRuleID) => [...featureRulesRoot, featureRuleId] as const
}
