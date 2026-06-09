export const ASSET_UNITS = ["Box", "Bottle", "Can"];

export const ASSETS_PAGE_SIZE = 5;

export const assets = [
  { id: "ast-1", no: 1, name: "Angkor", qty: 24, unit: "Box", createdBy: "Ek Vireak" },
  { id: "ast-2", no: 2, name: "Sting", qty: 18, unit: "Bottle", createdBy: "Teav luna" },
  { id: "ast-3", no: 3, name: "Fanta", qty: 0, unit: "Can", createdBy: "Ek Vireak" },
  { id: "ast-4", no: 4, name: "Tiger", qty: 12, unit: "Box", createdBy: "Sokha Chan" },
  { id: "ast-5", no: 5, name: "Coca Cola", qty: 30, unit: "Bottle", createdBy: "Teav luna" },
  { id: "ast-6", no: 6, name: "Pepsi", qty: 15, unit: "Can", createdBy: "Ek Vireak" },
  { id: "ast-7", no: 7, name: "Sprite", qty: 8, unit: "Bottle", createdBy: "Sokha Chan" },
  { id: "ast-8", no: 8, name: "Heineken", qty: 6, unit: "Box", createdBy: "Teav luna" },
  { id: "ast-9", no: 9, name: "Anchor", qty: 20, unit: "Box", createdBy: "Ek Vireak" },
  { id: "ast-10", no: 10, name: "Red Bull", qty: 0, unit: "Can", createdBy: "Sokha Chan" },
  { id: "ast-11", no: 11, name: "Mevius", qty: 10, unit: "Box", createdBy: "Teav luna" },
  { id: "ast-12", no: 12, name: "Carlsberg", qty: 14, unit: "Bottle", createdBy: "Ek Vireak" },
];

export function getAssetStatus(qty) {
  return qty > 0 ? "In Stock" : "Out of Stock";
}
