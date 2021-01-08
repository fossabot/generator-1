import * as unified from "unified";
import * as markdown from "remark-parse";
import * as markdownFrontmatter from "remark-frontmatter";
import * as mardownNormalizeHeadings from "remark-normalize-headings";
import * as mardownSectionize from "remark-sectionize";
import * as markdownMath from "remark-math";
import * as markdownToHtml from "remark-rehype";
import * as htmlRaw from "rehype-raw";
import * as htmlSlug from "rehype-slug";
import * as htmlHeadings from "rehype-autolink-headings";
import * as htmlCode from "rehype-highlight";
import * as htmlStringify from "rehype-stringify";

import htmlMathjax from "@ndcb/rehype-mathjax";
import htmlCustomElement, {
  CustomElementPluginOptions,
} from "@ndcb/rehype-custom-element";
import { extension } from "@ndcb/fs-util";
import { eitherFromThrowable } from "@ndcb/util/lib/either";
import { some } from "@ndcb/util/lib/option";

import { FileProcessor, Processor } from "./processor";
import { Transformer } from "./html";

export const markdownTransformer = ({
  mathjax = { tex: { tags: "ams" } },
  customElements,
}: Partial<{
  mathjax: Record<string, unknown>;
  customElements: CustomElementPluginOptions;
}> = {}): Transformer => {
  const processor = unified()
    .use(markdown)
    .use(markdownFrontmatter, ["yaml", "toml"])
    .use(mardownNormalizeHeadings)
    .use(mardownSectionize)
    .use(markdownMath)
    .use(markdownToHtml, {
      allowDangerousHtml: true,
    })
    .use(htmlRaw)
    .use(htmlSlug)
    .use(htmlHeadings)
    .use(htmlCode)
    .use(htmlMathjax, {
      mathjax,
      a11y: { assistiveMml: true },
    })
    .use(htmlCustomElement, customElements)
    .use(htmlStringify);
  return (contents, data) =>
    eitherFromThrowable(
      () => processor.processSync({ contents, data }).contents as string,
    );
};

export const markdownFileProcessors = (
  processor: Processor,
): FileProcessor[] => [
  {
    processor,
    sourceExtension: some(extension(".md")),
    destinationExtension: some(extension(".html")),
  },
  {
    processor,
    sourceExtension: some(extension(".markdown")),
    destinationExtension: some(extension(".html")),
  },
];
