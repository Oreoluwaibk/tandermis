export const skinLesionOptions = [
  { title: "Macule", additionalDetails: "Yes or No", description: "Non-palpable area of altered colour less than 1 cm wide" },
  { title: "Patch", additionalDetails: "Yes or No", description: "Non-palpable area of altered colour greater than 1 cm wide" },
  { title: "Papule", additionalDetails: "Yes or No", description: "Palpable elevated small area of skin (< 0.5 cm)" },
  { title: "Plaque", additionalDetails: "Yes or No", description: "Palpable flat-topped discoid lesion (> 2 cm wide)" },
  { title: "Nodule", additionalDetails: "Yes or No", description: "Solid palpable lesion within or on the skin (> 0.5 cm wide and up to 2 cm deep)" },
  { title: "Cyst", additionalDetails: "Yes or No", description: "A closed sac under the skin that has a lining and liquid or semi-solid contents" },
  { title: "Pustule", additionalDetails: "Yes or No", description: "Blister containing pus" },
  { title: "Vesicle", additionalDetails: "Yes or No", description: "Small fluid-filled blister (< 0.5 cm)" },
  { title: "Bullae", additionalDetails: "Yes or No", description: "Large fluid-filled blister (> 0.5 cm)" },
  { title: "Exudative", additionalDetails: "Yes or No", description: "Characterized by the presence of a discharge" },
  { title: "Abscess", additionalDetails: "Yes or No", description: "Collection of pus within the dermis and subcutaneous tissue" },
  { title: "Telangiectasia", additionalDetails: "Yes or No", description: "Dilatation of superficial blood vessel" },
  { title: "Purpura / Petechiae", additionalDetails: "Yes or No", description: "Petechiae: Non-blanchable pinhead-sized macules of blood. Purpura: Larger petechiae which do not blanch on pressure" },
  { title: "Hyperpigmentation", additionalDetails: "Yes or No", description: "Affected skin darker than surrounding normal skin" },
  { title: "Hypopigmentation", additionalDetails: "Yes or No", description: "Affected skin lighter than surrounding normal skin" },
  { title: "Scale", additionalDetails: "Yes or No", description: "Heaped up accumulations of horny epithelium" },
  { title: "Crust", additionalDetails: "Yes or No", description: "Dried exudate" },
  { title: "Excoriation", additionalDetails: "Yes or No", description: "A scratch" },
  { title: "Erythema", additionalDetails: "Yes or No", description: "Redness of the skin" },
  { title: "Blue", additionalDetails: "Yes or No", description: "Blueness of the skin or lesion" },
  { title: "Black", additionalDetails: "Yes or No", description: "A black skin or lesion" },
  { title: "Gray", additionalDetails: "Yes or No", description: "A gray skin or lesion" },
  { title: "Orange", additionalDetails: "Yes or No", description: "An orange skin or lesion" },
  { title: "Purple", additionalDetails: "Yes or No", description: "A purple skin or lesion" },
  { title: "Yellow", additionalDetails: "Yes or No", description: "Yellowness of the skin or lesion" },
  { title: "Fissure", additionalDetails: "Yes or No", description: "Slit in the skin" },
  { title: "Erosion", additionalDetails: "Yes or No", description: "Partial or total loss of epidermis which heals without scarring" },
  { title: "Ulcer", additionalDetails: "Yes or No", description: "Full thickness loss of the epidermis and part of the dermis which heals with scarring" },
  { title: "Scar", additionalDetails: "Yes or No", description: "Healing by replacement with fibrous tissue" },
  { title: "Atrophy", additionalDetails: "Yes or No", description: "Thinning of the skin due to shrinkage of epidermis, dermis, or subcutaneous fat" },
  { title: "Friable", additionalDetails: "Yes or No", description: "Fragile and easily bleeds or falls apart upon contact" },
  { title: "Lichenification", additionalDetails: "Yes or No", description: "Thickening of the epidermis with exaggerated skin margin" },
  { title: "Flat-topped", additionalDetails: "Yes or No", description: "Levels with the skin surface or has a wide flat top surface" },
  { title: "Dome-shaped", additionalDetails: "Yes or No", description: "Elevated, rounded, or curved lesion that rises above the surrounding skin" },
  { title: "Acuminate", additionalDetails: "Yes or No", description: "Has a pointed, conical shape" },
  { title: "Umbilicated", additionalDetails: "Yes or No", description: "Has a central, navel-like indentation" },
  { title: "Pedunculated", additionalDetails: "Yes or No", description: "Connects to the skin with a slender stalk" },
  { title: "Warty / Papilloma", additionalDetails: "Yes or No", description: "Pedunculated lesion projecting from the skin" },
  { title: "Exophytic", additionalDetails: "Yes or No", description: "Projects outward from the surface of the skin" },
  { title: "Induration", additionalDetails: "Yes or No", description: "Has a hard resistant feeling" },
  { title: "Poikiloderma", additionalDetails: "Yes or No", description: "Atrophy, reticulate hyperpigmentation and telangiectasia" },
  { title: "Burrow", additionalDetails: "Yes or No", description: "Linear or curved elevations of the superficial skin" },
  { title: "Comedo", additionalDetails: "Yes or No", description: "Dark horny keratin and sebaceous plugs within pilosebaceous openings" },
  { title: "Wheal", additionalDetails: "Yes or No", description: "Elevated lesion, often white with red margin due to dermal oedema" },
  { title: "Solitary", additionalDetails: "Yes or No", description: "Only one such lesion is present" },
  { title: "Does it itch?", additionalDetails: "Yes or No", description: "A sensation on the skin that causes one to want to scratch the area" },
];

export type SkinOptions = {
  [K in
    | "macule"
    | "patch"
    | "papule"
    | "plaque"
    | "nodule"
    | "cyst"
    | "pustule"
    | "vesicle"
    | "bullae"
    | "exudative"
    | "abscess"
    | "telangiectasia"
    | "purpura_petechiae"
    | "hyperpigmentation"
    | "hypopigmentation"
    | "scale"
    | "crust"
    | "excoriation"
    | "erythema"
    | "blue"
    | "black"
    | "gray"
    | "orange"
    | "purple"
    | "yellow"
    | "fissure"
    | "erosion"
    | "ulcer"
    | "scar"
    | "atrophy"
    | "friable"
    | "lichenification"
    | "flat_topped"
    | "dome_shaped"
    | "acuminate"
    | "umbilicated"
    | "pedunculated"
    | "warty_papilloma"
    | "exophytic"
    | "induration"
    | "poikiloderma"
    | "burrow"
    | "comedo"
    | "wheal"
    | "solitary"
    | "itch"]: boolean | null;
};

export interface IPersonalData {
    location: string;
    age: string;
    duration: string;
    skinType: number;
    frontImage: string;
    backImage: string;
    diagnosis: string;
}
export const partOfTheBody = [
    "Head and Neck",
    "Anterior chest",
    "Posterior chest",
    "Abdomen",
    "Lower back and buttocks",
    "Upper limbs",
    "Lower limbs",
    "Palms / Soles",
    "Mouth / Perineum",
]

export const fitzpatrickType = ["I", "II", "III", "IV", "V", "VI"]