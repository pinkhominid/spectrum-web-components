---
layout: root.njk
title: 'CSS Custom Properties: Spectrum Web Components'
displayName: CSS Custom Properties
slug: css-custom-properties
---

## Applying Spectrum to you application

Whether you leverage the dynamic theming capabilities of [`@spectrum-web-components/theme`](./components/theme) or the CSS based theming available in [`@spectrum-web-components/styles`](./components/styles) you will be making the [CSS Custom Property](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) based token system of Spectrum design available with you application. This means that you can apply those CSS Custom Properties to the components and pages that you are building with Spectrum Web Components. See the lists of available properties below. Switch between the various Spectrum color themes and scales to see how those values change based on the settings you apply to your application. When you find a property you'd like to you, click the swatch on the left to copy its usage into your clipboard.

<table class="spectrum-Table spectrum-Table--sizeM css-custom-property-listing">
    <thead class="spectrum-Table-head">
        <tr>
            <th class="spectrum-Table-headCell">Sample</th>
            <th class="spectrum-Table-headCell">Property</th>
            <th class="spectrum-Table-headCell">Value</th>
        </tr>
    </thead>
    <tbody class="spectrum-Table-body">
        {% for prop in customProperties %}<tr class="spectrum-Table-row">
            <td class="spectrum-Table-cell">
                <sp-thumbnail
                    class="sample"
                    background="var({{ prop.name }})"
                    size="s"
                    tabindex="0"
                ></sp-thumbnail>
            </td>
            <td class="spectrum-Table-cell">
                {{ prop.name }}
            </td>
            <td class="spectrum-Table-cell">
                {{ prop.value }}
            </td>
        </tr>{% endfor %}
    </tbody>
</table>
