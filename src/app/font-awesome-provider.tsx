'use client';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

// Prevent Font Awesome from adding its CSS since we did it manually above:
config.autoAddCss = false;

// Add all icons to the library so you can use it in your page
library.add(fab, fas);

export default function FontAwesomeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
