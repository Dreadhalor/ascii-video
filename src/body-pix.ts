import { setBackend } from '@tensorflow/tfjs';
import { load, BodyPix, toMask } from '@tensorflow-models/body-pix';
import {
  ModelConfig,
  PersonInferenceConfig,
} from '@tensorflow-models/body-pix/dist/body_pix_model';
import { BodyPixInput } from '@tensorflow-models/body-pix/dist/types';

export function loadBodyPix() {
  console.log('loaded');
  setBackend('webgl');
  let config: ModelConfig = {
    architecture: 'MobileNetV1',
    outputStride: 16,
    multiplier: 0.75,
    quantBytes: 2,
  };
  return load(config);
}

export function maskPerson(bp: BodyPix, input: BodyPixInput) {
  let segment_config: PersonInferenceConfig = {
    // flipHorizontal: false,
    internalResolution: 'high',
    segmentationThreshold: 0.6,
  };
  return bp.segmentPerson(input, segment_config).then((segmentation) => toMask(segmentation));
}
// export function maskVideo(bp: BodyPix, input: BodyPixInput) {
//   let segment_config: PersonInferenceConfig = {
//     // flipHorizontal: false,
//     internalResolution: 'low',
//     segmentationThreshold: 0.5,
//   };
//   return bp.segmentPerson(input, segment_config).then((segmentation) => toMask(segmentation));
// }
