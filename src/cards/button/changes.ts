import { getButtonType } from "./helpers.ts";
import { 
  applyScrollingEffect,
  getIcon,
  getIconColor,
  getImage,
  getName,
  getState,
  getAttribute,
  isStateOn,
  isEntityType
} from '../../tools/utils.ts';

export function changeButton(context) {
  const buttonType = getButtonType(context);
  const isOn = isStateOn(context);

  if ((buttonType ==='switch' || buttonType === 'custom') && isOn) {
      context.elements.buttonCard.style.backgroundColor = 'var(--accent-color)';
  } else {
      context.elements.buttonCard.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  }
}
export function changeIcon(context) {
  const isOn = isStateOn(context);
  const icon = getIcon(context);
  const image = getImage(context);

  if (isEntityType(context, "light") && isOn) {
      context.elements.iconContainer.style.color = getIconColor(context);
  } else {
      context.elements.iconContainer.style.color = '';
  }

  if (image !== '') {
      context.elements.image.style.backgroundImage = 'url(' + image + ')';
      context.elements.icon.style.display = 'none';
      context.elements.image.style.display = '';
  } else if (icon !== '') {
      context.elements.icon.icon = icon;
      context.elements.icon.style.color = isOn ? getIconColor(context) : 'inherit';
      context.elements.icon.style.display = '';
      context.elements.image.style.display = 'none';
  } else {
      context.elements.icon.style.display = 'none';
      context.elements.image.style.display = 'none';
  }
}
export function changeName(context) {
  const name = getName(context);
  if (name !== context.elements.previousName) {
      context.elements.name.innerText = name;
      applyScrollingEffect(context.elements.name, name);
      context.elements.previousName = name;
  }
}
export function changeSlider(context) {
  const buttonType = getButtonType(context);

  if (buttonType === 'slider') {
    context.elements.rangeFill.style.backgroundColor = getIconColor(context);

    if (context.dragging) return;

    let percentage = 0;

    if (isEntityType(context, "light")) {
      percentage = 100 * getAttribute(context, "brightness") / 255;
    } else if (isEntityType(context, "media_player")) {
      percentage = 100 * getAttribute(context, "volume_level");
    } else if (isEntityType(context, "cover")) {
      percentage = getAttribute(context, "current_position");
    } else if (isEntityType(context, "input_number")) {
      const minValue = getAttribute(context, "min");
      const maxValue = getAttribute(context, "max");
      const value = getState(context);
      percentage = 100 * (value - minValue) / (maxValue - minValue);
    }

    context.elements.rangeFill.style.transform = `translateX(${percentage}%)`;
  }
}

export function changeStatus(context) {
  const state = getState(context);

  if (state === 'unavailable') {
      context.card.classList.add('is-unavailable');
  } else {
      context.card.classList.remove('is-unavailable');
  }

  if (isEntityType(context, "light")) {
      context.card.classList.add('is-light');
  } else {
      context.card.classList.remove('is-light');
  }

  if (isStateOn(context)) {
      context.card.classList.add('is-on');
  } else {
      context.card.classList.remove('is-on');
  }
}
export function changeStyle(context) {
  const state = getState(context);

  const customStyle = context.config.styles
      ? Function('hass', 'entityId', 'state', 'return `' + context.config.styles + '`;')(context._hass, context.config.entity, state)
      : '';

  context.elements.customStyle.innerText = customStyle;
}