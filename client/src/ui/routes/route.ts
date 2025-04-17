export interface Route {
    link: string;
    component: React.FC;
    menuConfig?: MenuConfig;
}

export interface MenuConfig {
    icon: string;
    displayName: string;
    keyword: string;
}