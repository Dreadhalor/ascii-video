import { memory, setBackend } from '@tensorflow/tfjs';
import { load, BodyPix, toMask } from '@tensorflow-models/body-pix';
import {
  ModelConfig,
  PersonInferenceConfig,
} from '@tensorflow-models/body-pix/dist/body_pix_model';
import { BodyPixInput } from '@tensorflow-models/body-pix/dist/types';

export function loadBodyPix() {
  setBackend('webgl');
  let config: ModelConfig = {
    architecture: 'MobileNetV1',
    outputStride: 16,
    multiplier: 0.5,
    quantBytes: 4,
  };
  return load(config);
}

export function maskPerson(bp: BodyPix, input: BodyPixInput) {
  let segment_config: PersonInferenceConfig = {
    // flipHorizontal: false,
    internalResolution: 'medium',
    segmentationThreshold: 0.7,
  };
  // countTensors();
  return bp.segmentPerson(input, segment_config).then((segmentation) => toMask(segmentation));
}
function countTensors() {
  console.log(memory().numTensors);
}
// export function maskVideo(bp: BodyPix, input: BodyPixInput) {
//   let segment_config: PersonInferenceConfig = {
//     // flipHorizontal: false,
//     internalResolution: 'low',
//     segmentationThreshold: 0.5,
//   };
//   return bp.segmentPerson(input, segment_config).then((segmentation) => toMask(segmentation));
// }
