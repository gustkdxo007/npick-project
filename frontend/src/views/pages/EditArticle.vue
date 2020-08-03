<template>
  <div class="container mt-5">
    <v-text-field
      label="Title"
      single-line
      v-model="title"
      class="font-weight-bold font-size: 3rem"
    ></v-text-field>
    <div class="editor">
      <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
        <div class="menubar">
          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.bold() }"
            @click="commands.bold"
          >
            <img class="icon" src="@/assets/tiptap/icons/bold.svg" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.italic() }"
            @click="commands.italic"
          >
            <img class="icon" src="@/assets/tiptap/icons/italic.svg" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.strike() }"
            @click="commands.strike"
          >
            <img class="icon" src="@/assets/tiptap/icons/strike.svg" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.underline() }"
            @click="commands.underline"
          >
            <img class="icon" src="@/assets/tiptap/icons/underline.svg" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.code() }"
            @click="commands.code"
          >
            <img class="icon" src="@/assets/tiptap/icons/code.svg" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.paragraph() }"
            @click="commands.paragraph"
          >
            <img class="icon" src="@/assets/tiptap/icons/paragraph.svg" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.heading({ level: 1 }) }"
            @click="commands.heading({ level: 1 })"
          >H1</button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.heading({ level: 2 }) }"
            @click="commands.heading({ level: 2 })"
          >H2</button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.heading({ level: 3 }) }"
            @click="commands.heading({ level: 3 })"
          >H3</button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.bullet_list() }"
            @click="commands.bullet_list"
          >
            <img class="icon" src="@/assets/tiptap/icons/ul.svg" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.ordered_list() }"
            @click="commands.ordered_list"
          >
            <img class="icon" src="@/assets/tiptap/icons/ol.svg" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.blockquote() }"
            @click="commands.blockquote"
          >
            <img class="icon" src="@/assets/tiptap/icons/quote.svg" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.code_block() }"
            @click="commands.code_block"
          >
            <img class="icon" src="@/assets/tiptap/icons/code.svg" />
          </button>

          <button class="menubar__button" @click="commands.horizontal_rule">
            <img class="icon" src="@/assets/tiptap/icons/hr.svg" />
          </button>

          <button class="menubar__button" @click="commands.undo">
            <img class="icon" src="@/assets/tiptap/icons/undo.svg" />
          </button>

          <button class="menubar__button" @click="commands.redo">
            <img class="icon" src="@/assets/tiptap/icons/redo.svg" />
          </button>
        </div>
      </editor-menu-bar>

      <editor-menu-bubble
        :editor="editor"
        :keep-in-bounds="keepInBounds"
        v-slot="{ commands, isActive, menu }"
      >
        <div
          class="menububble"
          :class="{ 'is-active': menu.isActive }"
          :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`"
        >
          <button
            class="menububble__button"
            :class="{ 'is-active': isActive.bold() }"
            @click="commands.bold"
          >
            <img class="icon" src="@/assets/tiptap/icons/bold.svg" />
          </button>

          <button
            class="menububble__button"
            :class="{ 'is-active': isActive.italic() }"
            @click="commands.italic"
          >
            <img class="icon" src="@/assets/tiptap/icons/italic.svg" />
          </button>

          <button
            class="menububble__button"
            :class="{ 'is-active': isActive.code() }"
            @click="commands.code"
          >
            <img class="icon" src="@/assets/tiptap/icons/code.svg" />
          </button>
        </div>
      </editor-menu-bubble>

      <editor-content class="content" :editor="editor" />
      <!-- <v-textarea name id cols="30" rows="10" :editor="editor"></v-textarea> -->

      <v-flex offset-lg10 lg2>
        <v-btn small outlined color="secondary" class="mt-10" @click="addArticleItem">
          <v-icon left>mdi-plus</v-icon>SAVE
        </v-btn>
      </v-flex>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import { mapMutations } from "vuex";
import { Editor, EditorContent, EditorMenuBar, EditorMenuBubble } from "tiptap";
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History
} from "tiptap-extensions";

@Component({
  components: {
    EditorContent,
    EditorMenuBar,
    EditorMenuBubble
  },
  methods: mapMutations("mypageModule", ["addArticle"])
})
export default class EditArticle extends Vue {
  click() {
    console.log(this.title, this.html);
  }

  addArticleItem() {
    const articleItem = {
      title: this.title,
      content: this.html
    };
    this.addArticle(articleItem);
  }

  data() {
    return {
      keepInBounds: true,
      title: "",
      editor: new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History()
        ],
        content: `
          
        `,
        onUpdate: ({ getJSON, getHTML }) => {
          this.json = getJSON();
          this.html = getHTML();
        }
      }),
      json: "",
      html: ""
    };
  }
}
</script>
<style lang="scss" scope>
.icon {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: 0.8rem;
  height: 0.8rem;
  margin: 0 0.3rem;
  top: -0.05rem;
  fill: currentColor;

  // &.has-align-fix {
  // 	top: -.1rem;
  // }

  &__svg {
    display: inline-block;
    vertical-align: top;
    width: 100%;
    height: 100%;
  }

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }
}

// svg sprite
body > svg,
.icon use > svg,
symbol {
  path,
  rect,
  circle,
  g {
    fill: currentColor;
    stroke: none;
  }

  *[d="M0 0h24v24H0z"] {
    display: none;
  }
}

.menububble {
  background-color: white !important;
}

.content {
  box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.1);
  border: 1px solid #dbdbdb;
  display: block;
  min-height: 250px;
  max-width: 100%;
  min-width: 100%;
  padding: 0.625em;
  resize: vertical;
  background-color: white;
  border-radius: 4px;
}
</style>


