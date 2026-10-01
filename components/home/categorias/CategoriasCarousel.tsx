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
  const hasNavigation = categorias.length > 5;

  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="relative flex items-center gap-4 min-h-55">
        {hasNavigation && <CategoriaNavButton id="prev" direction="prev" />}

        <div className="flex-1 overflow-hidden">
          <Swiper
            modules={hasNavigation ? [Navigation] : []}
            navigation={
              hasNavigation ? { prevEl: "#prev", nextEl: "#next" } : false
            }
            spaceBetween={12}
            autoHeight={false}
            centeredSlides={false}
            centerInsufficientSlides={true}
            centeredSlidesBounds={true}
            className="w-full min-h-25"
            breakpoints={{
              0: { slidesPerView: 2.2, centeredSlides: true },
              640: { slidesPerView: 3.5, centeredSlides: true },
              1024: { slidesPerView: 5, centeredSlides: false },
              1280: { slidesPerView: 6, centeredSlides: false },
            }}
          >
            {categorias.map((categoria) => (
              <SwiperSlide key={categoria.id}>
                <CategoriaSlide slug={categoria.slug} nome={categoria.nome} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {hasNavigation && <CategoriaNavButton id="next" direction="next" />}
      </div>
    </div>
  );
}
