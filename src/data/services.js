import {
  GalleryHorizontalEnd,
  Image,
  MonitorPlay,
  PanelsTopLeft,
  ScrollText,
  Sparkles,
} from "lucide-react";

export const services = [
  {
    id: "poster-feed",
    title: "Poster Feed",
    description:
      "Desain poster untuk publikasi kegiatan, pengumuman, campaign, open recruitment, ucapan, dan informasi organisasi melalui feed Instagram.",
    size: "1080 × 1350 px",
    turnaround: "2–4 hari",
    icon: Image,
  },

  {
    id: "instagram-story",
    title: "Instagram Story",
    description:
      "Desain vertikal untuk reminder kegiatan, countdown, informasi singkat, repost kebutuhan acara, dan publikasi melalui Instagram Story.",
    size: "1080 × 1920 px",
    turnaround: "1–3 hari",
    icon: MonitorPlay,
  },

  {
    id: "banner-cetak",
    title: "Banner Cetak",
    description:
      "Desain banner untuk kebutuhan cetak seperti acara, seminar, workshop, sponsorship, backdrop, dan kegiatan organisasi lainnya.",
    size: "300 × 100 cm / Custom",
    turnaround: "3–5 hari",
    icon: GalleryHorizontalEnd,
  },

  {
    id: "banner-digital",
    title: "Banner Digital",
    description:
      "Desain banner horizontal untuk layar LED, website, presentasi acara, publikasi digital, dan kebutuhan visual pada media elektronik.",
    size: "1920 × 1080 px",
    turnaround: "2–4 hari",
    icon: PanelsTopLeft,
  },

  {
    id: "sertifikat",
    title: "Sertifikat",
    description:
      "Desain sertifikat untuk peserta, panitia, narasumber, moderator, pemenang, mitra, dan kebutuhan penghargaan kegiatan.",
    size: "A4 Landscape • 3508 × 2480 px",
    turnaround: "2–4 hari",
    icon: ScrollText,
  },

  {
    id: "lainnya",
    title: "Lainnya",
    description:
      "Kebutuhan desain yang tidak termasuk kategori utama seperti ID card, twibbon, thumbnail, PPT, template, logo kegiatan, dan kebutuhan visual lainnya.",
    size: "Custom sesuai kebutuhan",
    turnaround: "Diskusi",
    icon: Sparkles,
  },
];