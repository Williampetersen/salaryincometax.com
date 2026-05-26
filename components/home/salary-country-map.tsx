"use client";

import { useEffect, useMemo, useRef } from "react";
import maplibregl from "maplibre-gl";

import type { CountrySummary } from "@/lib/country-catalog";

const CARTO_LIGHT_STYLE = {
  version: 8,
  sources: {
    carto: {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        "https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
  },
  layers: [
    {
      id: "carto",
      type: "raster",
      source: "carto",
      minzoom: 0,
      maxzoom: 19,
    },
  ],
} satisfies maplibregl.StyleSpecification;

const COUNTRY_COORDINATES: Record<string, [number, number]> = {
  australia: [133.7751, -25.2744],
  belgium: [4.4699, 50.5039],
  canada: [-106.3468, 56.1304],
  denmark: [9.5018, 56.2639],
  france: [2.2137, 46.2276],
  germany: [10.4515, 51.1657],
  ireland: [-8.2439, 53.4129],
  italy: [12.5674, 41.8719],
  japan: [138.2529, 36.2048],
  luxembourg: [6.1296, 49.8153],
  malta: [14.3754, 35.9375],
  netherlands: [5.2913, 52.1326],
  "new-zealand": [174.886, -40.9006],
  norway: [8.4689, 60.472],
  singapore: [103.8198, 1.3521],
  spain: [-3.7492, 40.4637],
  sweden: [18.6435, 60.1282],
  "united-kingdom": [-3.436, 55.3781],
  "united-states": [-95.7129, 37.0902],
};

interface SalaryCountryMapProps {
  countries: CountrySummary[];
}

export function SalaryCountryMap({ countries }: SalaryCountryMapProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markers = useMemo(
    () =>
      countries
        .map((country) => ({
          ...country,
          coordinates: COUNTRY_COORDINATES[country.slug],
        }))
        .filter(
          (
            country,
          ): country is CountrySummary & { coordinates: [number, number] } =>
            Boolean(country.coordinates),
        ),
    [countries],
  );

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: CARTO_LIGHT_STYLE,
      center: [18, 32],
      zoom: 1.15,
      minZoom: 1,
      maxZoom: 5,
      attributionControl: false,
    });

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "bottom-right",
    );
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-left");

    const markerInstances = markers.map((country) => {
      const markerElement = document.createElement("a");
      markerElement.className =
        "block h-4 w-4 rounded-full border-2 border-white bg-moss shadow-[0_0_0_6px_rgba(49,95,76,0.18)] transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-moss focus:ring-offset-2";
      markerElement.href = `/salary-calculator/${country.slug}`;
      markerElement.title = `${country.name} salary calculator`;
      markerElement.setAttribute("aria-label", `${country.name} salary calculator`);

      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 14,
      }).setHTML(
        `<a class="block rounded-xl px-2 py-1 text-sm font-semibold text-ink" href="/salary-calculator/${country.slug}">${country.name}</a>`,
      );

      return new maplibregl.Marker({ element: markerElement })
        .setLngLat(country.coordinates)
        .setPopup(popup)
        .addTo(map);
    });

    return () => {
      markerInstances.forEach((marker) => marker.remove());
      map.remove();
    };
  }, [markers]);

  return (
    <section className="shell pt-12" id="country-map">
      <div className="panel overflow-hidden p-0">
        <div className="grid gap-0 lg:grid-cols-[0.48fr_1.52fr]">
          <div className="p-6 sm:p-8">
            <p className="eyebrow">Global coverage</p>
            <h2 className="mt-4 font-[var(--font-display)] text-2xl font-bold sm:text-3xl">
              Salary calculators by country
            </h2>
            <p className="mt-4 text-sm leading-7 text-ink/65">
              Explore the countries currently covered by the salary and income tax
              calculators.
            </p>
          </div>
          <div className="min-h-[380px] border-t border-ink/10 lg:border-l lg:border-t-0">
            <div
              aria-label="Map of supported salary calculator countries"
              className="h-[380px] w-full sm:h-[460px]"
              ref={containerRef}
              role="img"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
