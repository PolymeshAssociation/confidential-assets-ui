import { polkadotIcon } from '@polkadot/ui-shared';
import { useMemo } from 'react';

interface IdenticonProps {
  address: string;
  /** Rendered width and height, e.g. `32px` or `2rem`. */
  size: string;
  /** Fill for the outer circle. Defaults to transparent. */
  background?: string;
}

/**
 * Polkadot-style identicon rendered as an inline SVG. The circles come from
 * `polkadotIcon`, the same generator the polkadot.js apps and extension use.
 */
export function Identicon({
  address,
  size,
  background = 'transparent',
}: IdenticonProps) {
  const circles = useMemo(() => {
    try {
      return polkadotIcon(address, { isAlternative: false });
    } catch {
      // Not a decodable SS58 address. Render an empty placeholder instead of throwing.
      return [];
    }
  }, [address]);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label={`Identicon for ${address}`}
      style={{ flexShrink: 0 }}
    >
      {circles.map(({ cx, cy, fill, r }, index) => (
        <circle
          key={index}
          cx={cx}
          cy={cy}
          r={r}
          fill={index === 0 ? background : fill}
        />
      ))}
    </svg>
  );
}
