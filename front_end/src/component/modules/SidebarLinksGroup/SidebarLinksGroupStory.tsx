import attributes from './attributes.json';
import { SidebarLinksGroup } from './SidebarLinksGroup';
import { StoryWrapper } from './StoryWrapper';

export default { title: 'NavbarLinksGroup' };

export function Usage() {
  return <StoryWrapper attributes={attributes} component={SidebarLinksGroup} />;
}
