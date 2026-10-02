"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import CategoriaSlide from "./CategoriaSlide";
import CategoriaNavButton from "./CategoriaNavButton";

import "swiper/css";
import "swiper/css/navigation";

import type { Categoria } from "@/types/categoria";

export default function CategoriasCarousel({
  categorias,
}: {
  categorias: Categoria[];
}) {
  if (!categorias.length) {
    return null;
  }

  const hasNavigation = categorias.length > 4;

  return (
    <div className="relative">
      {hasNavigation && (
        <div className="absolute -top-14 right-0 hidden items-center gap-2 sm:flex">
          <CategoriaNavButton id="prev" direction="prev" />
          <CategoriaNavButton id="next" direction="next" />
        </div>
      )}

      <Swiper
        modules={hasNavigation ? [Navigation] : []}
        navigation={
          hasNavigation
            ? {
                prevEl: "#prev",
                nextEl: "#next",
              }
            : false
        }
        spaceBetween={14}
        slidesPerView={1.25}
        breakpoints={{
          480: {
            slidesPerView: 1.6,
          },
          640: {
            slidesPerView: 2.2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
          1280: {
            slidesPerView: 4.5,
          },
        }}
        className="!overflow-visible"
      >
        {categorias.map((categoria, index) => (
          <SwiperSlide key={categoria.id}>
            <CategoriaSlide
              slug={categoria.slug}
              nome={categoria.nome}
              index={index}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
