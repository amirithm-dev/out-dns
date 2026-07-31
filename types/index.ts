export type SelectedDNS = {
    name: string;
    primary: string;
    secondary: string;
}

export type DNSEntry = {
    id: string;
    name: string;
    primary_dns: string;
    secondary_dns: string;
}

export type DatabaseDNSEntry = {
    id: string,
    suggestedBy: string,
    name: string,
    primary: string,
    secondary: string,
    description: object,
    recommended: boolean
    order: number,
    createdAt: string,
    updatedAt: string,
}