import { lazier } from '~~/helpers/lazier';

export const ExampleUI = lazier(() => import('./exampleui/ExampleUI'), 'ExampleUI');
export const Checkout = lazier(() => import('./checkout/Checkout'), 'Checkout');
export const Subgraph = lazier(() => import('./subgraph/Subgraph'), 'Subgraph');
export const Hints = lazier(() => import('./hints/Hints'), 'Hints');
