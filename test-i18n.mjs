import nlTranslations from './app/i18n/nl/index.ts';
import enTranslations from './app/i18n/en/index.ts';

console.log('✓ NL translations loaded successfully');
console.log('  Keys:', Object.keys(nlTranslations).join(', '));
console.log('  Sample (app.title):', nlTranslations.app.title);

console.log('\n✓ EN translations loaded successfully');
console.log('  Keys:', Object.keys(enTranslations).join(', '));
console.log('  Sample (app.title):', enTranslations.app.title);

console.log('\n✓ All translations loaded successfully!');
