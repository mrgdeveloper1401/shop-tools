import { ComponentPreview } from './ComponentPreview';

export interface CanvasAttributes {
  responsive?: boolean;
  withColor?: boolean;
  dimmed?: boolean;
  canvas: { center: boolean; maxWidth?: number };
  category: string;
  title: string;
  props?: Record<string, any>;
}

interface StoryWrapperProps {
  attributes: CanvasAttributes;
  component: React.FC<any>;
}

export function StoryWrapper({
  attributes,
  component: Component,
}: StoryWrapperProps) {
  return (
    <ComponentPreview canvas={attributes.canvas} withSpacing>
      <Component {...(attributes.props || null)} />
    </ComponentPreview>
  );
}
