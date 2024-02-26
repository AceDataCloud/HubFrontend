export interface IMidjourneyMode {
  icon: string;
  name: string;
  displayName: string;
}

export interface IMidjourneyPreset {
  model?: string;
  ratio?: string;
  version?: string;
  stylize?: number;
  chaos?: number;
  advanced?: boolean;
  quality?: string;
  weird?: number;
  iw?: number;
  style?: string;
  translation?: boolean;
}

export enum MidjourneyImagineAction {
  GENERATE = 'generate',
  UPSCALE1 = 'upscale1',
  UPSCALE2 = 'upscale2',
  UPSCALE3 = 'upscale3',
  UPSCALE4 = 'upscale4',
  VARIATION1 = 'variation1',
  VARIATION2 = 'variation2',
  VARIATION3 = 'variation3',
  VARIATION4 = 'variation4',
  VARIATION_STRONG = 'variation_strong',
  VARIATION_SUBTLE = 'variation_subtle',
  UPSCALE_SUBTLE = 'upscale_subtle',
  UPSCALE_CREATIVE = 'upscale_creative',
  ZOOM_OUT_2X = 'zoom_out_2x',
  ZOOM_OUT_1_5X = 'zoom_out_1_5x',
  SQUARE = 'square',
  PAN_LEFT = 'pan_left',
  PAN_UP = 'pan_up',
  PAN_DOWN = 'pan_down',
  PAN_RIGHT = 'pan_right',
  REROLL = 'reroll',
  UPSCALE_2X = 'upscale_2x',
  UPSCALE_4X = 'upscale_4x',
  REDO_UPSCALE_2X = 'redo_upscale_2x',
  REDO_UPSCALE_4X = 'redo_upscale_4x'
}

export enum MidjourneyImagineState {
  PENDING = 'pending',
  GENERATING = 'generating',
  FINISHED = 'finished',
  FAILED = 'failed'
}

export interface IMidjourneyImagineRequest {
  action?: MidjourneyImagineAction;
  prompt?: string;
  image_id?: string;
  translation?: boolean;
  callback_url?: string;
  application_id?: string;
}

export interface IMidjourneyImagineResponse {
  task_id: string;
  progress: number;
  image_id: string;
  image_url: string;
  trace_id: string;
  raw_image_url: string;
  actions: MidjourneyImagineAction[];
  code?: string;
  detail?: string;
  success?: boolean;
}

export interface IMidjourneyImagineTask {
  id: string;
  created_at?: string;
  request?: IMidjourneyImagineRequest;
  response?: IMidjourneyImagineResponse;
  state?: MidjourneyImagineState;
}

export interface IMidjourneyImagineOptions {
  stream?: (response: IMidjourneyImagineResponse) => void;
  token?: string;
  endpoint?: string;
  path?: string;
}
