import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export interface Route {
    link: string;
    component: React.FC;
    menuConfig?: MenuConfig;
}

export interface MenuConfig {
    displayName: string;
    icon: IconDefinition;
    keyword: string;
}