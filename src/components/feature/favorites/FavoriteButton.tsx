'use client';

import { useEffect, useState } from 'react';
import SaveButton from '@/components/ui/SaveButton';
import { useFavoriteStore } from '@/stores/useFavoriteStore';

interface FavoriteButtonProps {
  itemId: number;
  size?: number | 'responsive';
  onToggle?: (isFavorite: boolean) => void;
}

export default function FavoriteButton({ itemId, size = 48, onToggle }: FavoriteButtonProps) {
  const { toggleFavorite, isFavorite, _hasHydrated } = useFavoriteStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (_hasHydrated) setHydrated(true);
  }, [_hasHydrated]);

  if (!hydrated) {
    return <SaveButton isSaved={false} ariaLabel="찜하기" onToggle={() => {}} size={size} />;
  }

  const isSaved = isFavorite(itemId);

  const handleToggle = () => {
    toggleFavorite(itemId);
    if (onToggle) onToggle(!isSaved);
  };

  return <SaveButton isSaved={isSaved} ariaLabel="찜하기" onToggle={handleToggle} size={size} />;
}
