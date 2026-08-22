// components/admin/property-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";

type UploadedImage = {
  url: string;
  order: number;
};

type PropertyFormProps = {
  mode: "create" | "edit";
  propertyId?: string;
  initialData?: {
    title: string;
    description: string;
    price: number;
    address: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    bedrooms: number;
    bathrooms: number;
    parkings: number;
    images: UploadedImage[];
  };
};

export function PropertyForm({
  mode,
  propertyId,
  initialData,
}: PropertyFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );
  const [price, setPrice] = useState(initialData?.price?.toString() ?? "");
  const [address, setAddress] = useState(initialData?.address ?? "");
  const [city, setCity] = useState(initialData?.city ?? "");
  const [country, setCountry] = useState(initialData?.country ?? "");
  const [latitude, setLatitude] = useState(
    initialData?.latitude?.toString() ?? "",
  );
  const [longitude, setLongitude] = useState(
    initialData?.longitude?.toString() ?? "",
  );
  const [bedrooms, setBedrooms] = useState(
    initialData?.bedrooms?.toString() ?? "",
  );
  const [bathrooms, setBathrooms] = useState(
    initialData?.bathrooms?.toString() ?? "",
  );
  const [parkings, setParkings] = useState(
    initialData?.parkings?.toString() ?? "",
  );
  const [images, setImages] = useState<UploadedImage[]>(
    initialData?.images ?? [],
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const sigRes = await fetch("/api/admin/cloudinary-signature", {
        method: "POST",
      });

      if (!sigRes.ok) {
        throw new Error("No se pudo obtener la firma de subida");
      }

      const { signature, timestamp, cloudName, apiKey, folder } =
        await sigRes.json();

      const uploaded: UploadedImage[] = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", String(timestamp));
        formData.append("signature", signature);
        formData.append("folder", folder);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: formData },
        );

        if (!uploadRes.ok) {
          throw new Error("Error al subir una de las imágenes");
        }

        const data = await uploadRes.json();
        uploaded.push({
          url: data.secure_url,
          order: images.length + uploaded.length,
        });
      }

      setImages((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir imágenes");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(index: number) {
    setImages((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((img, i) => ({ ...img, order: i })),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (images.length === 0) {
      setError("Agrega al menos una imagen");
      return;
    }

    setSubmitting(true);

    const payload = {
      title,
      description,
      price: Number(price),
      address,
      city,
      country,
      latitude: Number(latitude),
      longitude: Number(longitude),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      parkings: Number(parkings),
      images,
    };

    const url =
      mode === "create"
        ? "/api/admin/propiedades"
        : `/api/admin/propiedades/${propertyId}`;
    const method = mode === "create" ? "POST" : "PATCH";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Error al guardar la propiedad");
        setSubmitting(false);
        return;
      }

      toast.success(
        mode === "create" ? "Propiedad creada" : "Propiedad actualizada",
      );
      router.push("/admin/propiedades");
      router.refresh();
    } catch {
      setError("Error de conexión, intenta de nuevo");
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!propertyId) return;
    if (
      !confirm(
        "¿Seguro que quieres borrar esta propiedad? Esta acción no se puede deshacer.",
      )
    ) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/propiedades/${propertyId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "Error al borrar la propiedad");
        setDeleting(false);
        return;
      }

      toast.success("Propiedad eliminada");
      router.push("/admin/propiedades");
      router.refresh();
    } catch {
      setError("Error de conexión, intenta de nuevo");
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label className="block text-sm font-medium text-ink">Título</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink">
          Descripción
        </label>
        <textarea
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink">
            Precio por noche (USD)
          </label>
          <input
            required
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">
            Dirección
          </label>
          <input
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink">Ciudad</label>
          <input
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">País</label>
          <input
            required
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink">Latitud</label>
          <input
            required
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Longitud</label>
          <input
            required
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink">
            Habitaciones
          </label>
          <input
            required
            type="number"
            min="0"
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Baños</label>
          <input
            required
            type="number"
            min="0"
            value={bathrooms}
            onChange={(e) => setBathrooms(e.target.value)}
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">
            Estacionamientos
          </label>
          <input
            required
            type="number"
            min="0"
            value={parkings}
            onChange={(e) => setParkings(e.target.value)}
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink">Imágenes</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          disabled={uploading}
          className="mt-1 block text-sm"
        />
        {uploading && (
          <p className="mt-2 text-sm text-stone-600">Subiendo imágenes...</p>
        )}

        {images.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-2">
            {images.map((img, i) => (
              <div key={img.url} className="group relative h-20 w-full">
                <Image
                  src={img.url}
                  alt={`Imagen ${i + 1}`}
                  fill
                  className="rounded-md object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute right-1 top-1 hidden h-5 w-5 rounded-full bg-red-600 text-xs text-white group-hover:block"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting || uploading}
          className="rounded-md bg-ink px-6 py-2 text-sm font-medium text-canvas-soft hover:bg-brass disabled:opacity-50"
        >
          {submitting
            ? "Guardando..."
            : mode === "create"
              ? "Crear propiedad"
              : "Guardar cambios"}
        </button>

        {mode === "edit" && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            {deleting ? "Borrando..." : "Borrar propiedad"}
          </button>
        )}
      </div>
    </form>
  );
}
