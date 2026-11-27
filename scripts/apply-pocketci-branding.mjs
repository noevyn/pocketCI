import { readFile, writeFile, readdir, mkdir } from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";

const repoRoot = process.cwd();
const upstream = path.join(repoRoot, "upstream", "DroidRunner");
const expectedRevision = "5126eacf2855a252d38121238d787eacec6f3965";
const actualRevision = execFileSync(
  "git",
  ["-C", upstream, "rev-parse", "HEAD"],
  { encoding: "utf8" },
).trim();

if (actualRevision !== expectedRevision) {
  throw new Error(
    `Refusing to patch unexpected DroidRunner revision ${actualRevision}; expected ${expectedRevision}`,
  );
}

async function replaceOnce(relativePath, before, after) {
  const file = path.join(upstream, relativePath);
  const source = await readFile(file, "utf8");
  const count = source.split(before).length - 1;
  if (count !== 1) {
    throw new Error(`${relativePath}: expected one match, found ${count}`);
  }
  await writeFile(file, source.replace(before, after));
}

async function replaceRegexOnce(relativePath, pattern, replacement) {
  const file = path.join(upstream, relativePath);
  const source = await readFile(file, "utf8");
  const matches = [...source.matchAll(pattern)];
  if (matches.length !== 1) {
    throw new Error(`${relativePath}: expected one regex match, found ${matches.length}`);
  }
  await writeFile(file, source.replace(pattern, replacement));
}

async function renameThemeSymbols(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await renameThemeSymbols(file);
    } else if (entry.isFile() && entry.name.endsWith(".kt")) {
      const source = await readFile(file, "utf8");
      const updated = source
        .replaceAll("BtopColors", "PocketCIColors")
        .replaceAll("BtopTheme", "PocketCITheme");
      if (updated !== source) await writeFile(file, updated);
    }
  }
}

// Keep the upstream package namespace so internal class references remain
// stable, but give PocketCI its own install identity so both apps can coexist.
await replaceOnce(
  "app/build.gradle.kts",
  'applicationId = "io.github.m96chan.droidrunner"',
  'applicationId = "com.noevyn.pocketci"',
);

{
  const file = path.join(upstream, "app/build.gradle.kts");
  let source = await readFile(file, "utf8");
  source = source.replaceAll("droidrunner.", "pocketci.");
  source = source.replaceAll("DROIDRUNNER_RELEASE_TAG", "POCKETCI_RELEASE_TAG");

  const runtimeRepoLine =
    '        buildConfigField("String", "RUNTIME_REPO", "\\"\u0024{project.findProperty("pocketci.runtimeRepo") ?: ""}\\"")';
  if (!source.includes(runtimeRepoLine)) {
    throw new Error("app/build.gradle.kts: PocketCI runtime repo field was not found");
  }
  source = source.replace(
    runtimeRepoLine,
    runtimeRepoLine + `
        buildConfigField("String", "POCKETCI_SOURCE_URL", "\\"\u0024{project.findProperty("pocketci.sourceUrl") ?: "https://github.com/noevyn/pocketCI"}\\"")
        buildConfigField("String", "POCKETCI_SOURCE_COMMIT", "\\"\u0024{project.findProperty("pocketci.sourceCommit") ?: ""}\\"")`,
  );
  await writeFile(file, source);
}

// The upstream GitHub App client ID is deliberately not reused. The app will
// explain that its own GitHub App must be configured until these public values
// are supplied as PocketCI repository variables at build time.
{
  const file = path.join(upstream, "gradle.properties");
  let source = await readFile(file, "utf8");
  const mappings = [
    [/^droidrunner\.githubAppClientId=.*$/m, "pocketci.githubAppClientId="],
    [/^droidrunner\.githubAppSlug=.*$/m, "pocketci.githubAppSlug="],
    [/^droidrunner\.runtimeRepo=.*$/m, "pocketci.runtimeRepo=m96-chan/DroidRunner"],
    [
      /^droidrunner\.runtimeSigningKeys=.*$/m,
      "pocketci.runtimeSigningKeys=MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEAxTe0bAgmrhdoHQnr3PfCEp7UtKOk74dbfTvjJXkuCtbROaczoOQioVHt3bjAb/1ntuKD96n3LKvB4gLbE4c/w==",
    ],
  ];
  for (const [pattern, replacement] of mappings) {
    if ([...source.matchAll(pattern)].length !== 1) {
      throw new Error(`gradle.properties: expected exactly one ${pattern}`);
    }
    source = source.replace(pattern, replacement);
  }
  await writeFile(file, source);
}

await replaceOnce(
  "app/src/main/AndroidManifest.xml",
  'android:label="DroidRunner"',
  'android:label="PocketCI"',
);
await replaceOnce(
  "app/src/main/AndroidManifest.xml",
  'android:theme="@style/Theme.DroidRunner"',
  'android:theme="@style/Theme.PocketCI"',
);
await replaceOnce(
  "app/src/main/res/values/styles.xml",
  'name="Theme.DroidRunner"',
  'name="Theme.PocketCI"',
);
{
  const file = path.join(upstream, "app/src/main/res/values/styles.xml");
  let source = await readFile(file, "utf8");
  source = source
    .replaceAll("monospace", "sans")
    .replaceAll("#52D0DB", "#5CD6C0")
    .replaceAll("#0B0E14", "#0B121A");
  await writeFile(file, source);
}
await replaceOnce(
  "app/src/main/res/values/colors.xml",
  "#0B0E14",
  "#0B121A",
);

await renameThemeSymbols(path.join(upstream, "app/src/main/java"));

await writeFile(
  path.join(upstream, "app/src/main/java/io/github/m96chan/droidrunner/ui/theme/BtopTheme.kt"),
  `package io.github.m96chan.droidrunner.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.lerp
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

/** PocketCI's restrained dark palette for a device-first operations dashboard. */
object PocketCIColors {
    val Background = Color(0xFF0B121A)
    val Panel = Color(0xFF121D27)
    val Border = Color(0xFF263746)
    val Text = Color(0xFFE4EDF2)
    val Dim = Color(0xFF8B9EAA)
    val Cyan = Color(0xFF5CD6C0)
    val Green = Color(0xFF63C99A)
    val Yellow = Color(0xFFF0C36A)
    val Red = Color(0xFFEF8585)
    val Magenta = Color(0xFFB69AF7)
    val Blue = Color(0xFF83B4F4)

    fun forLoad(fraction: Float): Color = when {
        fraction < 0.6f -> lerp(Green, Yellow, (fraction / 0.6f) * 0.5f)
        fraction < 0.85f -> lerp(Yellow, Red, (fraction - 0.6f) / 0.25f * 0.6f)
        else -> Red
    }
}

private val pocketCITypography = Typography(
    headlineMedium = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.SemiBold,
        fontSize = 22.sp,
    ),
    titleMedium = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.SemiBold,
        fontSize = 15.sp,
    ),
    bodyLarge = TextStyle(fontFamily = FontFamily.SansSerif, fontSize = 14.sp),
    bodyMedium = TextStyle(fontFamily = FontFamily.SansSerif, fontSize = 13.sp),
    bodySmall = TextStyle(fontFamily = FontFamily.SansSerif, fontSize = 11.sp),
    labelLarge = TextStyle(fontFamily = FontFamily.SansSerif, fontWeight = FontWeight.Medium, fontSize = 13.sp),
    labelMedium = TextStyle(fontFamily = FontFamily.SansSerif, fontSize = 11.sp),
    labelSmall = TextStyle(fontFamily = FontFamily.SansSerif, fontSize = 10.sp),
)

@Composable
fun PocketCITheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = darkColorScheme(
            primary = PocketCIColors.Cyan,
            secondary = PocketCIColors.Magenta,
            background = PocketCIColors.Background,
            surface = PocketCIColors.Panel,
            surfaceVariant = PocketCIColors.Panel,
            onPrimary = PocketCIColors.Background,
            onBackground = PocketCIColors.Text,
            onSurface = PocketCIColors.Text,
            onSurfaceVariant = PocketCIColors.Dim,
            outline = PocketCIColors.Border,
            error = PocketCIColors.Red,
        ),
        typography = pocketCITypography,
        content = content,
    )
}
`,
);

// Product-facing strings and HTTP identification.
await replaceOnce(
  "app/src/main/java/io/github/m96chan/droidrunner/ui/DashboardScreen.kt",
  'Text("DroidRunner",',
  'Text("PocketCI",',
);
await replaceOnce(
  "app/src/main/java/io/github/m96chan/droidrunner/github/GitHubAuth.kt",
  '"DroidRunner/0.1"',
  '"PocketCI/0.1"',
);
await replaceOnce(
  "app/src/main/java/io/github/m96chan/droidrunner/github/GitHubApi.kt",
  '"DroidRunner/0.1"',
  '"PocketCI/0.1"',
);
await replaceOnce(
  "app/src/main/java/io/github/m96chan/droidrunner/security/SecretStore.kt",
  '"droidrunner-pat"',
  '"pocketci-keystore"',
);
await replaceOnce(
  "app/src/main/java/io/github/m96chan/droidrunner/ui/SetupScreen.kt",
  "This build has no GitHub App client id (droidrunner.githubAppClientId). ",
  "This build has no PocketCI GitHub App client id (pocketci.githubAppClientId). ",
);
await replaceOnce(
  "app/src/main/java/io/github/m96chan/droidrunner/ui/SetupScreen.kt",
  "The DroidRunner GitHub App is not installed on any repository you can manage.",
  "The PocketCI GitHub App is not installed on any repository you can manage.",
);

// PocketCI's own source offer plus an explicit upstream attribution link.
{
  const file = path.join(upstream, "app/src/main/java/io/github/m96chan/droidrunner/ui/AboutPanel.kt");
  let source = await readFile(file, "utf8");
  source = source.replace(
    'private const val PROJECT_URL = "https://github.com/m96-chan/DroidRunner"',
    'private const val PROJECT_URL = "https://github.com/noevyn/pocketCI"\nprivate const val UPSTREAM_URL = "https://github.com/m96-chan/DroidRunner"',
  );
  source = source.replace(
    `            gitCommit = BuildConfig.GIT_COMMIT,
        )`,
    `            gitCommit = BuildConfig.POCKETCI_SOURCE_COMMIT,
            projectUrl = BuildConfig.POCKETCI_SOURCE_URL,
        )`,
  );
  source = source.replace(
    '            Link("project source") { open(PROJECT_URL) }',
    '            Link("project source") { open(BuildConfig.POCKETCI_SOURCE_URL) }',
  );
  source = source.replace(
    '            Link("proot source") { open("$PROOT_URL/tree/${BuildConfig.PROOT_COMMIT}") }',
    '            Link("proot source") { open("$PROOT_URL/tree/${BuildConfig.PROOT_COMMIT}") }\n            Link("upstream source") { open("$UPSTREAM_URL/tree/${BuildConfig.GIT_COMMIT}") }',
  );
  source = source.replace(
    '            Link("report an issue") { open("$PROJECT_URL/issues/new") }',
    '            Link("report an issue") { open("${BuildConfig.POCKETCI_SOURCE_URL}/issues/new") }',
  );
  source = source.replace(
    "internal fun sourceOffer(versionName: String, prootCommit: String, gitCommit: String): SourceOffer {",
    "internal fun sourceOffer(versionName: String, prootCommit: String, gitCommit: String, projectUrl: String = PROJECT_URL): SourceOffer {",
  );
  source = source
    .replaceAll("droidrunner-$tag-source.tar.gz", "pocketci-$tag-source.tar.gz")
    .replaceAll("droidrunner-<tag>-source.tar.gz", "pocketci-<tag>-source.tar.gz")
    .replaceAll("$PROJECT_URL/releases/download/$tag/$archive", "$projectUrl/releases/download/$tag/$archive")
    .replaceAll("$PROJECT_URL/tree/$gitCommit", "$projectUrl/tree/$gitCommit")
    .replaceAll("url = PROJECT_URL", "url = projectUrl")
    .replaceAll("DroidRunner ${BuildConfig.VERSION_NAME}", "PocketCI ${BuildConfig.VERSION_NAME}");
  if (source.includes("droidrunner-<tag>-source.tar.gz") || source.includes("DroidRunner ${BuildConfig.VERSION_NAME}")) {
    throw new Error("AboutPanel.kt: PocketCI source-offer branding was incomplete");
  }
  await writeFile(file, source);
}

{
  const file = path.join(upstream, "app/src/test/java/io/github/m96chan/droidrunner/ui/SourceOfferTest.kt");
  let source = await readFile(file, "utf8");
  source = source
    .replaceAll("droidrunner-v", "pocketci-v")
    .replaceAll("https://github.com/m96-chan/DroidRunner/releases/download/", "https://github.com/noevyn/pocketCI/releases/download/")
    .replaceAll("https://github.com/m96-chan/DroidRunner/tree/", "https://github.com/noevyn/pocketCI/tree/")
    .replaceAll("https://github.com/m96-chan/DroidRunner", "https://github.com/noevyn/pocketCI")
    .replaceAll("DroidRunner", "PocketCI");
  await writeFile(file, source);
}

// Adaptive icon: a compact pocket with a two-stage CI path.
await mkdir(path.join(upstream, "app/src/main/res/drawable"), { recursive: true });
await writeFile(
  path.join(upstream, "app/src/main/res/drawable/ic_pocketci_foreground.xml"),
  `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#182A36"
        android:pathData="M31,28 C31,23 35,19 40,19 H68 C73,19 77,23 77,28 V78 C77,83 73,87 68,87 H40 C35,87 31,83 31,78 Z" />
    <path
        android:fillColor="#00000000"
        android:pathData="M44,39 V69 M44,44 H65 M44,64 H65"
        android:strokeColor="#5CD6C0"
        android:strokeWidth="5"
        android:strokeLineCap="round"
        android:strokeLineJoin="round" />
    <path
        android:fillColor="#E4EDF2"
        android:pathData="M65,38 A6,6 0,1 0,65 50 A6,6 0,1 0,65 38 M65,58 A6,6 0,1 0,65 70 A6,6 0,1 0,65 58" />
</vector>
`,
);
for (const icon of ["ic_launcher.xml", "ic_launcher_round.xml"]) {
  await replaceOnce(
    `app/src/main/res/mipmap-anydpi-v26/${icon}`,
    '@mipmap/ic_launcher_foreground',
    '@drawable/ic_pocketci_foreground',
  );
}

console.log("PASS: applied PocketCI app identity, palette, source attribution, and icon");
console.log(`PASS: DroidRunner foundation remains pinned at ${expectedRevision}`);
