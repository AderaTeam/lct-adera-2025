export default {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-prettier-scss'],
  rules: {
    // разрешает использование :global()
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global'] }],
    // BEM-like class selectors: BlockName__elementName_modifierName
    'selector-class-pattern': [
      '^([A-Z]+[a-z0-9]+)+(__[a-z0-9]+([A-Z][a-z0-9]+)*)?(_[a-z0-9]+([A-Z][a-z0-9]+)*)?$',
      { resolveNestedSelectors: true }
    ],
    // запрещает пустую строку после, например, @include
    'declaration-empty-line-before': ['never'],
    // возможность группировать SCSS-переменные
    'scss/dollar-variable-empty-line-before': null,
    // возможность группировать CSS-переменные
    'custom-property-empty-line-before': null,
    // мешает работать с _modifierName
    'no-descending-specificity': null,
    // правила для //-комментариев
    'scss/double-slash-comment-empty-line-before': [
      'always',
      { except: ['first-nested', 'inside-block'], ignore: ['between-comments'] }
    ]
  }
};
