export interface CharacterAsset {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: 'character' | 'location' | 'costume' | 'prop';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  metadata?: {
    size?: string;
    dimensions?: string;
    colorScheme?: string;
    notes?: string;
  };
}

export interface CharacterSettings {
  id: string;
  name: string;
  description: string;
  mainImage: CharacterAsset;
  locations: CharacterAsset[];
  costumes: CharacterAsset[];
  props: CharacterAsset[];
  profile: {
    age?: string;
    height?: string;
    weight?: string;
    birthday?: string;
    bloodType?: string;
    personality?: string;
    background?: string;
  };
}