import * as mpSelfieSegmentation from '@mediapipe/selfie_segmentation';
import * as bodySegmentation from '@tensorflow-models/body-segmentation';

const modelName = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation; // literally a string

type ModelConfig = {
  type: 'general' | 'landscape';
  visualization: 'mask' | 'binaryMask' | 'blurBodyPart' | 'partMap';
};
export const SELFIE_SEGMENTATION_CONFIG: ModelConfig = {
  type: 'general',
  visualization: 'binaryMask',
};

const model = bodySegmentation.createSegmenter(modelName, {
  runtime: 'mediapipe',
  modelType: SELFIE_SEGMENTATION_CONFIG.type,
  solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@${mpSelfieSegmentation.VERSION}`,
});

export const loadSSModel = async () => {
  return model;
};

export async function maskPersonSS(
  model: bodySegmentation.BodySegmenter,
  imageData: HTMLCanvasElement | HTMLVideoElement
) {
  return model
    .segmentPeople(imageData, {
      flipHorizontal: false,
      internalResolution: 'low',
      segmentationThreshold: 0.5,
    })
    .then((segmentation) => bodySegmentation.toBinaryMask(segmentation));
}
