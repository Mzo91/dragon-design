import { existsSync, readFileSync, statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) =>
  readFileSync(new URL(relative, import.meta.url), 'utf8');

const homeHeroSource = read('../../src/components/HomeHero.tsx');
const entryNavRailSource = read('../../src/components/EntryNavRail.tsx');
const appLayoutSource = read('../../app/layout.tsx');
const primitivesCss = read('../../src/styles/primitives.css');
const enLocale = read('../../src/i18n/locales/en.ts');
const zhCnLocale = read('../../src/i18n/locales/zh-CN.ts');
const dragonLogoUrl = new URL('../../public/dragon-design-logo.png', import.meta.url);

describe('Home logo assets', () => {
  it('ships the Dragon Design logo as a public web asset', () => {
    expect(existsSync(dragonLogoUrl)).toBe(true);
    expect(statSync(dragonLogoUrl).size).toBeGreaterThan(100_000);
  });

  it('uses the Dragon Design logo for shared brand glyphs', () => {
    expect(primitivesCss).toContain('url(/dragon-design-logo.png)');
    expect(primitivesCss).not.toContain('url(/brand-icon.svg)');
  });

  it('renders the Dragon Design brand on both Home entry surfaces', () => {
    expect(homeHeroSource).toContain("{t('app.brand')}");
    expect(homeHeroSource).not.toContain('home-hero__brand-name">Open Design');
    expect(homeHeroSource).toContain('od-brand-glyph');

    expect(entryNavRailSource).toContain('od-brand-glyph');
  });

  it('sets the primary visible app brand to Dragon Design', () => {
    expect(enLocale).toContain("'app.brand': 'Dragon Design'");
    expect(zhCnLocale).toContain('"app.brand": "Dragon Design"');
    expect(enLocale).toContain('Bundled plugins ship with Dragon Design');
    expect(zhCnLocale).toContain('目录为空。Dragon Design 会随附内置插件');
  });

  it('uses Dragon Design for browser metadata and app icons', () => {
    expect(appLayoutSource).toContain("title: 'Dragon Design'");
    expect(appLayoutSource).toContain("icon: '/dragon-design-logo.png'");
    expect(appLayoutSource).toContain("apple: '/dragon-design-logo.png'");
  });
});
