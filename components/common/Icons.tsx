import { type LucideIcon, MoonStar, Sun } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
function interopIcon(icon: LucideIcon) {
  cssInterop(icon, {
    className: {
      target: 'style',
      nativeStyleToProp: {
        color: true,
        opacity: true,
      },
    },
  });
}

interopIcon(Sun);
interopIcon(MoonStar);

export { MoonStar, Sun };
