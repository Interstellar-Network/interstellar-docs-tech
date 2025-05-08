import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Interstellar',
  tagline: 'Instant onboarding and ultra secure access layer to Web3',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://docs.interstellar.network',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'interstellar-docs-tech', // Usually your GitHub org/user name.
  projectName: 'interstellar-docs-tech', // Usually your repo name.

  onBrokenLinks: 'throw', /*'throw', to set for production*/ 
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },


  presets: [
    [
      'classic',
      {
        
        docs: {
          //routeBasePath: '/', // This makes /docs your homepage
          //sidebarPath: require.resolve('./sidebars.ts'),


          sidebarPath: require.resolve('./sidebars.ts'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          //editUrl:
          //  'https://github.com/Interstellar-Network/interstellar-docs',
        },
        blog: false, /*{
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/Interstellar-Network/interstellar-docs',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },*/
        //links: { },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'developers',
        path: 'developers',
        routeBasePath: 'developers',
        sidebarPath: require.resolve('./devsidebar.ts'),
      },
    ],
  ],


  themeConfig: {
    // Replace with your project's social card
    /*image: 'img/docusaurus-social-card.jpg',*/
    navbar: {
      title: 'Interstellar',
      logo: {
        alt: 'Interstellar Logo',
        src: 'img/Interstellar_Circle_Icon_Black.svg',
        srcDark: 'img/Interstellar_Circle_Icon_White.svg',
      },
      items: [

        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation Hub',
        },

        
        {
          to: '/developers', // <-- This links to your custom page!
          label: 'Developers',
          position: 'left',
          // Remove type, sidebarId, docsPluginId
        },

        
       /*{to: '/blog', label: 'Blog', position: 'left'},*/
       /*{to: 'links', label: 'Ressources', position: 'left'},*/

        {
          href: 'https://interstellar.network',
          label: 'Interstellar',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        
        {
          title: 'Community',
          items: [
            { 
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/company/0xinterstellar',
              
            },
            {
              label: 'Discord',
              href: 'https://discord.com/invite/zHkk875URW',
            },
            
            {
              label: 'X',
              href: 'https://x.com/0xInterstellar',
            },
          ],
        },
        
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Interstellar, Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
