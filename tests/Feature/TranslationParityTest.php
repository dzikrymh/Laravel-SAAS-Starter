<?php

use Illuminate\Support\Arr;

/**
 * @return array<string, string>
 */
function loadJsonTranslations(string $path): array
{
    return json_decode(file_get_contents($path), true, flags: JSON_THROW_ON_ERROR);
}

it('has a backend translation file for every supported locale', function () {
    foreach (config('app.supported_locales') as $locale) {
        expect(lang_path("{$locale}.json"))->toBeFile();
    }
});

it('has a frontend translation file for every supported locale', function () {
    foreach (config('app.supported_locales') as $locale) {
        expect(resource_path("js/locales/{$locale}.json"))->toBeFile();
    }
});

it('translates every backend key into the locale', function (string $locale) {
    $english = loadJsonTranslations(lang_path('en.json'));
    $translated = loadJsonTranslations(lang_path("{$locale}.json"));

    expect(array_diff_key($english, $translated))->toBeEmpty();
})->with(['es', 'fr', 'ar', 'id']);

it('translates every frontend key into the locale', function (string $locale) {
    $english = loadJsonTranslations(resource_path('js/locales/en.json'));
    $translated = loadJsonTranslations(resource_path("js/locales/{$locale}.json"));

    expect(array_diff_key($english, $translated))->toBeEmpty();
})->with(['es', 'fr', 'ar', 'id']);

it('translates every notification key into indonesian', function () {
    $english = Arr::dot(require lang_path('en/notifications.php'));
    $indonesian = Arr::dot(require lang_path('id/notifications.php'));

    expect(array_diff_key($english, $indonesian))->toBeEmpty();
});

it('keeps every placeholder in the indonesian translations', function (string $directory) {
    $english = loadJsonTranslations(base_path("{$directory}/en.json"));
    $indonesian = loadJsonTranslations(base_path("{$directory}/id.json"));

    foreach ($english as $key => $value) {
        preg_match_all('/:[a-z_]+|{{\s*\w+\s*}}/', $value, $placeholders);

        foreach ($placeholders[0] as $placeholder) {
            expect($indonesian[$key])->toContain($placeholder);
        }
    }
})->with([
    'backend' => 'lang',
    'frontend' => 'resources/js/locales',
]);

it('lets users switch to indonesian', function () {
    $this->patch(route('locale.update'), ['locale' => 'id'])->assertRedirect();

    expect(session('locale'))->toBe('id')
        ->and(__('auth.layout.back_to_home', locale: 'id'))->toBe('Kembali ke beranda');
});
