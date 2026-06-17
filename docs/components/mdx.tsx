import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Tab, Tabs, TabsList, TabsTrigger } from 'fumadocs-ui/components/tabs';
import type { MDXComponents } from 'mdx/types';

type PackageManagerLabelProps = {
  icon: string;
  name: string;
};

type BrandIconProps = {
  alt: string;
  src: string;
};

function BrandIcon({ alt, src }: BrandIconProps) {
  return <img alt={alt} className="size-4" src={src} />;
}

function PackageManagerLabel({ icon, name }: PackageManagerLabelProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <img alt="" aria-hidden="true" className="size-4" src={icon} />
      <span>{name}</span>
    </span>
  );
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    BrandIcon,
    PackageManagerLabel,
    Tab,
    Tabs,
    TabsList,
    TabsTrigger,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
