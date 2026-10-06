CREATE TABLE "parceiros" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "href" VARCHAR(2048) NOT NULL,
    "logo_desktop_url" TEXT NOT NULL,
    "logo_mobile_url" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "parceiros_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "parceiros_ordem_idx"
ON "parceiros"("ordem");

INSERT INTO "parceiros"
    ("nome", "href", "logo_desktop_url", "logo_mobile_url", "ordem")
VALUES
    (
        'Maratona de Berlim',
        'https://www.bmw-berlin-marathon.com/en/registration/tour-operators',
        '/img/banner-berlim.png',
        NULL,
        0
    ),
    (
        'Maratona de Paris',
        'https://www.schneiderelectricparismarathon.com/fr/participer/agences-voyages',
        '/img/banner-paris.png',
        NULL,
        1
    ),
    (
        'Meia Maratona de Paris',
        'https://www.hokasemideparis.fr/fr/participer/tour-operateurs',
        '/img/banner-meia_paris.png',
        NULL,
        2
    ),
    (
        'Maratona de Sydney',
        'https://www.tcssydneymarathon.com/international-entry',
        '/img/banner-sydney.png',
        '/img/banner-sydney-mobile.png',
        3
    ),
    (
        'Maratona de Cape Town',
        'https://capetownmarathon.com/international-entry/',
        '/img/banner-cape_town.png',
        NULL,
        4
    ),
    (
        'Maratona de Xangai',
        'https://shmarathon.com/',
        '/img/banner-shangai.png',
        NULL,
        5
    ),
    (
        'Maratona de Chicago',
        'https://www.chicagomarathon.com',
        '/img/banner-chicago.png',
        '/img/banner-chicago-mobile.png',
        6
    ),
    (
        'Atout France',
        'https://www.atout-france.fr/en',
        '/img/banner-atout-france.png',
        NULL,
        7
    );