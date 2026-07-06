// ============================================================
// 统一图片生成适配器类型定义
// ============================================================

export interface ModelInfo {
  id: string;
  name: string;
  platform: string;
  maxResolution: { width: number; height: number };
  supportsReferenceImage: boolean;
  supportsNegativePrompt: boolean;
  strengths: string[];
}

export interface GenerateParams {
  prompt: string;
  negativePrompt?: string;
  model: string;
  width: number;
  height: number;
  style?: string;
  referenceImages?: string[];
  numImages: number;
}

export interface GeneratedImage {
  base64: string;
  url?: string;
  width: number;
  height: number;
}

export interface GenerateResult {
  images: GeneratedImage[];
  modelUsed: string;
  cost: number;
}

export interface ImageGenAdapter {
  platform: string;
  models: ModelInfo[];

  generate(params: GenerateParams): Promise<GenerateResult>;
  validateApiKey(apiKey: string, baseUrl?: string): Promise<boolean>;
}

// ============================================================
// Prompt 模板
// ============================================================

export type AssetCategory = 'shadiao-classic' | 'moe-cute';
export type AssetType = 'background' | 'character' | 'sticker';

export const PROMPT_TEMPLATES: Record<string, string> = {
  'bg-shadiao-classic':
    '夸张搞笑的卡通背景，鲜艳配色，粗犷线条，{scene}，表情包风格，扁平化设计',
  'char-shadiao-classic':
    '沙雕风格卡通人物，{description}，夸张表情，暴走漫画风格，粗线条，高饱和度，白色背景，全身站立姿势',
  'sticker-shadiao':
    '沙雕表情包贴纸，{emotion}表情，夸张魔性，暴走漫画风格，白底，高清，适合做贴纸',
  'bg-moe-cute':
    '可爱Q版卡通场景，柔和配色，圆润造型，{scene}，温馨治愈风格，扁平化设计',
  'char-moe-cute':
    'Q版可爱卡通角色，{description}，圆润可爱，柔和配色，简单干净，白色背景，全身站立姿势',
  'sticker-moe':
    '可爱表情贴纸，{emotion}表情，Q版萌系，柔和配色，白底，高清，适合做贴纸',
};

export function buildPrompt(
  templateKey: string,
  replacements: Record<string, string>
): string {
  let template = PROMPT_TEMPLATES[templateKey];
  if (!template) {
    throw new Error(`Unknown prompt template: ${templateKey}`);
  }
  for (const [key, value] of Object.entries(replacements)) {
    template = template.replace(`{${key}}`, value);
  }
  return template;
}

export function getPromptTemplateKey(
  type: AssetType,
  category: AssetCategory
): string {
  return `${type}-${category}`;
}
