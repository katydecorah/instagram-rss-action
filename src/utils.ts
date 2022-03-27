import { warning, info } from "@actions/core";
import { removeEmoji, removeHashTags } from "./remover.js";

export function generateFeed(posts: Feed[], metadata: Metadata) {
  return {
    version: "https://jsonfeed.org/version/1.1",
    ...metadata,
    items: posts,
  };
}

function truncate(str: string) {
  const split = str.split(/(\.|\n|!)/)[0];
  let trimmed = split.substring(0, 50);
  if (split.length > trimmed.length) trimmed += "…";
  return trimmed.trim();
}

function titlize(arr: string[]) {
  const firstItem = arr[0];
  return firstItem ? truncate(firstItem) : "";
}

function getCaption(
  obj: Node["edge_media_to_caption"],
  pretty: boolean
): string[] {
  const caption = obj.edges.map((item) => item.node).map((item) => item.text);
  return pretty ? formatCaption(caption) : caption;
}

function formatCaption(arr: string[]) {
  if (arr && arr.length > 0) {
    return arr.reduce((lines: string[], line) => {
      let formatted = removeEmoji(line);
      if (formatted) formatted = removeHashTags(formatted);
      if (formatted) formatted = formatted.trim();
      if (formatted) lines = [...lines, ...formatted];
      return lines;
    }, []);
  }
  return [];
}

function formatContent(arr: string[]) {
  if (arr.length > 0) {
    return arr.map((line) => `<p>${line}</p>`).join("");
  }
  return "";
}

function video({
  video_url,
  display_url,
  edge_sidecar_to_children,
}: {
  video_url: Node["video_url"];
  display_url: Node["display_url"];
  edge_sidecar_to_children: Node["edge_sidecar_to_children"];
}) {
  if (edge_sidecar_to_children) return sidecar(edge_sidecar_to_children);
  return `<p><video src="${video_url}" poster="${display_url}" type="video/mp4">Sorry, your browser doesn't support embedded videos.</video></p>`;
}

function sidecar({ edges }) {
  return edges
    .map((item: Edge) => item.node)
    .reduce(
      (str: string, item: Node) =>
        (str += item.is_video ? video(item) : image(item)),
      ""
    );
}

function image({
  display_url,
  edge_sidecar_to_children,
}: {
  display_url: string;
  edge_sidecar_to_children: EdgeSideCar;
}): string {
  if (edge_sidecar_to_children) return sidecar(edge_sidecar_to_children);
  return `<p><img src="${display_url}" alt="" /></p>`;
}

export function formatFeed(
  feed: {
    user: { edge_owner_to_timeline_media: EdgeOwnerToTimelineMedia };
  },
  handle: string,
  pretty: boolean
): Feed[] | [] {
  if (!feed.user) {
    warning(
      `Failed to fetch Instagram feed for ${handle}. The username is incorrect or the Instagram API has ratelimited this request.`
    );
    return [];
  }
  const posts = feed.user.edge_owner_to_timeline_media.edges.map(
    (item) => item.node
  );
  info(`Fetched posts for @${handle}`);
  return posts.map((p) => {
    const caption = getCaption(p.edge_media_to_caption, pretty);
    const media = p.is_video ? video(p) : image(p);

    return {
      id: p.id,
      url: `https://instagram.com/p/${p.shortcode}`,
      title: titlize(caption),
      content_html: `<p>@${handle}</p>${formatContent(caption)}${media}`,
      summary: handle,
      authors: [
        {
          name: handle,
        },
      ],
      date_published: new Date(p.taken_at_timestamp * 1000).toISOString(),
      image: p.display_url,
    };
  });
}

export type Feed = {
  id: string;
  url: string;
  title: string;
  content_html: string;
  summary: string;
  authors: { name: string }[];
  date_published: string;
  image: string;
};

export type EdgeSideCar = {
  edges: {
    node: Node[];
  };
};

export type Node = {
  __typename: string;
  id: string;
  dimensions: {
    height: number;
    width: number;
  };
  display_url: string;
  display_resources: {
    src: string;
    config_width: number;
    config_height: number;
  }[];
  is_video: boolean;
  should_log_client_event: boolean;
  tracking_token: string;
  edge_sidecar_to_children: EdgeSideCar;
  edge_media_to_tagged_user: {
    edges: [];
  };
  edge_media_to_caption: {
    edges: {
      node: {
        text: string;
      };
    }[];
  };
  shortcode: string;
  edge_media_to_comment: {
    count: number;
    page_info: {
      has_next_page: boolean;
      end_cursor: any;
    };
    edges: [];
  };
  comments_disabled: boolean;
  taken_at_timestamp: number;
  edge_media_preview_like: {
    count: number;
  };
  gating_info: null;
  media_preview: string;
  owner: {
    id: string;
  };
  thumbnail_src: string;
  thumbnail_resources: {
    src: string;
    config_width: number;
    config_height: number;
  }[];
  video_url: string;
};

export type Edge = {
  node: Node;
};

export type EdgeOwnerToTimelineMedia = {
  count: number;
  page_info: {
    has_next_page: boolean;
    end_cursor: string;
  };
  edges: Edge[];
};

export type Metadata = {
  title: string;
  description: string;
};
