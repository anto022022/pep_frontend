import { useTranslations } from 'next-intl';

export function useLocalizedOptions<T extends Record<string, any>>(
    file: string,
    options: T[],
    labelKey: string = 'name',
    translatingKey: keyof T = "name"
) {
    const t = useTranslations(file);

    return options.map((opt) => ({
        ...opt,
        [labelKey]: t(opt[translatingKey as keyof T]), // add translated label
    }));
}
