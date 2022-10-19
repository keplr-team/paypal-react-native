/**
 * Ce plugin normalement devrait être dans la lib RN paypal mais pour faciliter le test du plugin je l'ai mis pour le moment dans le projet de
 * l'app de test.
 */
import {
  AndroidConfig,
  ConfigPlugin,
  createRunOncePlugin,
  withProjectBuildGradle,
  withAndroidManifest,
  withMainApplication,
} from '@expo/config-plugins';
import {
  createGeneratedHeaderComment,
  MergeResults,
  removeGeneratedContents,
} from '@expo/config-plugins/build/utils/generateCode';

const pkg = require('../../package.json');

export type Props = {
  paypalClientId: string;
  paypalReturnUrl: string;
  env: string;
};

/**
 * Setup Paypal in the onCreate method of the MainApplication class.
 */
const withPaypalMainApplication: ConfigPlugin<Props> = (
  config,
  { paypalClientId, paypalReturnUrl, env }
) => {
  return withMainApplication(config, async (c) => {
    c.modResults.contents = modifyMainApplication({
      contents: c.modResults.contents,
      paypalClientId,
      paypalReturnUrl,
      env,
      packageName: AndroidConfig.Package.getPackage(c),
    });

    return c;
  });
};

const modifyMainApplication = ({
  contents,
  paypalClientId,
  paypalReturnUrl,
  env,
  packageName,
}: {
  contents: string;
  paypalClientId: string;
  paypalReturnUrl: string;
  env: string;
  packageName: string | null;
}) => {
  if (!packageName) {
    throw new Error('Android package not found');
  }

  // Add the import line to the top of the file
  const importLine = `import com.paypalreactnative.RNPaypalModule;`;
  if (!contents.includes(importLine)) {
    const packageImport = `package ${packageName};`;
    contents = contents.replace(
      `${packageImport}`,
      `${packageImport}\n${importLine}`
    );
  }

  // Add the init line in the onCreate method
  const initLine = `RNPaypalModule.Companion.setup(this, "${paypalClientId}", "${paypalReturnUrl}", "${env}");`;
  if (!contents.includes(initLine)) {
    const soLoaderLine = `SoLoader.init(this, /* native exopackage */ false);`;
    contents = contents.replace(
      `${soLoaderLine}`,
      `${soLoaderLine}\n\t\t${initLine}\n`
    );
  }

  return contents;
};

/**
 * Set tools:replace="android:allowBackup" in AndroidManifest.xml
 */
const withPaypalAndroidManifest: ConfigPlugin<{}> = (config) => {
  return withAndroidManifest(config, async (c) => {
    c.modResults.manifest.$ = {
      ...c.modResults.manifest.$,
      'xmlns:tools': 'http://schemas.android.com/tools',
    };

    if (c.modResults.manifest.application?.[0]) {
      c.modResults.manifest.application[0].$ = {
        ...c.modResults.manifest.application[0].$,
        'tools:replace': 'android:allowBackup',
      };
    }

    return c;
  });
};

/**
 * Add required repository to android/build.gradle
 */
const withPaypalProjectBuildGradle: ConfigPlugin<{}> = (config) => {
  return withProjectBuildGradle(config, async (c) => {
    if (c.modResults.language === 'groovy') {
      c.modResults.contents = addPaypalRepo(c.modResults.contents).contents;
    } else {
      throw new Error(
        'Cannot add paypal repo because the build.gradle is not groovy'
      );
    }
    return c;
  });
};

//   allprojects {
//   repositories {
//     maven {
//       url "https://cardinalcommerceprod.jfrog.io/artifactory/android"
//       credentials {
//         // Be sure to add these non-sensitive credentials in order to retrieve dependencies from
//         // the private repository.
//         username "paypal_sgerritz"
//         password "AKCp8jQ8tAahqpT5JjZ4FRP2mW7GMoFZ674kGqHmupTesKeAY2G8NcmPKLuTxTGkKjDLRzDUQ"
//       }
//     }
//   }
// }
const gradleMaven = `allprojects {\n\trepositories {\n\t\tmaven {\n\t\t\turl "https://cardinalcommerceprod.jfrog.io/artifactory/android"\n\t\t\tcredentials {\n\t\t\t\tusername "paypal_sgerritz"\n\t\t\t\tpassword "AKCp8jQ8tAahqpT5JjZ4FRP2mW7GMoFZ674kGqHmupTesKeAY2G8NcmPKLuTxTGkKjDLRzDUQ"\n\t\t\t}\n\t\t}\n\t}\n}`;

export function addPaypalRepo(src: string): MergeResults {
  return appendContents({
    tag: 'expo-paypal-repo',
    src,
    newSrc: gradleMaven,
    comment: '//',
  });
}

// Fork of config-plugins mergeContents, but appends the contents to the end of the file.
function appendContents({
  src,
  newSrc,
  tag,
  comment,
}: {
  src: string;
  newSrc: string;
  tag: string;
  comment: string;
}): MergeResults {
  const header = createGeneratedHeaderComment(newSrc, tag, comment);
  if (!src.includes(header)) {
    // Ensure the old generated contents are removed.
    const sanitizedTarget = removeGeneratedContents(src, tag);
    const contentsToAdd = [
      // @something
      header,
      // contents
      newSrc,
      // @end
      `${comment} @generated end ${tag}`,
    ].join('\n');

    return {
      contents: sanitizedTarget ?? src + contentsToAdd,
      didMerge: true,
      didClear: !!sanitizedTarget,
    };
  }
  return { contents: src, didClear: false, didMerge: false };
}

/**
 * Configure android files to add paypal
 */
const withPaypalAndroid: ConfigPlugin<Props> = (
  config,
  { paypalClientId, paypalReturnUrl, env }
) => {
  config = withPaypalProjectBuildGradle(config, {});
  config = withPaypalAndroidManifest(config, {});
  config = withPaypalMainApplication(config, {
    paypalClientId,
    paypalReturnUrl,
    env,
  });

  return config;
};

const withPaypal: ConfigPlugin<Props> = (config, props) => {
  config = withPaypalAndroid(config, props);

  return config;
};

export default createRunOncePlugin(withPaypal, pkg.name, pkg.version);
