/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { html, TemplateResult } from '@spectrum-web-components/base';
import '@spectrum-web-components/field-label/sp-field-label.js';

import '../sp-color-slider.js';
import { ColorChannel, ColorSlider } from '../src/ColorSlider.js';
export default {
    title: 'Color/Slider/Channels',
    component: 'sp-color-slider',
};

const Template = ({
    channel = 'hue',
    color = 'red',
}: {
    channel: ColorChannel;
    color: string;
}): TemplateResult => {
    return html`
        <sp-field-label for="color-slider-${channel}">
            ${channel}
        </sp-field-label>
        <sp-color-slider
            id="color-slider-${channel}"
            channel=${channel}
            color=${color}
        ></sp-color-slider>
    `;
};

export const red = (): TemplateResult =>
    Template({ channel: 'red', color: 'red' });
export const green = (): TemplateResult =>
    Template({ channel: 'green', color: 'green' });
export const blue = (): TemplateResult =>
    Template({ channel: 'blue', color: 'blue' });

export const RGB = (): TemplateResult => html`
    <div
        @input=${(event: Event) => {
            const target = event.target as ColorSlider;
            const color = target.color;
            const sliders = [
                ...(target.parentElement as HTMLDivElement).querySelectorAll(
                    'sp-color-slider'
                ),
            ];
            sliders.forEach((slider) => (slider.color = color));
        }}
    >
        ${Template({ channel: 'red', color: 'red' })}
        ${Template({ channel: 'green', color: 'red' })}
        ${Template({ channel: 'blue', color: 'red' })}
    </div>
`;
