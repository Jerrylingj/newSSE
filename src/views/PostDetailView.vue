<template>
  <div
    class="root"
    @click="clickHandler"
    @comment-handle="commentHandler"
  >
    <detail-card
      v-if="isPostLoaded"
      :post="post"
    />
    <div v-else>
      loading...
    </div>
    <div class="comment">
      <h2>评论</h2>
      <!-- 这是评论区 -->
      <div class="commentList">
        <!-- 使用id-评论数作为key使每次评论重新渲染当前评论 -->
        <div
          v-for="comment in comments"
          :key="`${comment.PcommentID}-${comment.SubComments.length}`"
          class="comment"
        >
          <comment-card
            :comment="comment"
            :show-comment="postCommentID === comment.PcommentID"
          >
            <template #showComment>
              <button
                v-if="comment.SubComments.length"
                @click="
                  postCommentID =
                    postCommentID === comment.PcommentID
                      ? -1
                      : comment.PcommentID
                "
              >
                {{
                  postCommentID === comment.PcommentID
                    ? '不想看了'
                    : '让我看看'
                }}
              </button>
            </template>
          </comment-card>
          <div
            v-show="postCommentID === comment.PcommentID"
            class="subCommentList"
          >
            <c-comment-card
              v-for="subComment in comment.SubComments"
              :key="subComment.ccommentID"
              :p-comment-id="comment.PcommentID"
              :comment="subComment"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, inject, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

import { getPostByID } from '@/api/browse/getPost';
import { getCommentsByPostID } from '@/api/browse/getComment';

import { strHandler } from '@/utils/strHandler';

import { showImg } from '@/components/ImageShower';
import { showMsg } from '@/components/MessageBox';
import DetailCard from '@/components/card/DetailCard.vue';
import CommentCard from '@/components/card/CommentCard.vue';
import CCommentCard from '@/components/card/CCommentCard.vue';

const route = useRoute();

const userInfo = inject('userInfo');

const post = ref({});
const isPostLoaded = computed(() => Object.keys(post.value).length !== 0);
const comments = ref([]);
const postCommentID = ref(0);

const commentHandler = async (event) => {
	const func = event.detail;
	try {
		const res = await func(userInfo.value.phone, post.value.PostID);
		if (res) {
			showMsg('成功');
			await getCommentList();
		} else {
			showMsg('失败');
		}
	} catch (e) {
		console.error(e);
		showMsg('失败');
	}
};

const getCommentList = async () => {
	try {
		const ID = Number(route.params.id);
		const curComments = await getCommentsByPostID(ID, userInfo.value.phone);
		if(curComments) curComments.reverse();
		comments.value = curComments;
	}catch(e){
		showMsg(`获取评论失败: ${e}`);
	}
};

/**
 *
 * @description 复制代码和展示图片。直接绑定根容器
 */
const clickHandler = async (event) => {
	/**
	 * 在css里已经去除了pre标签的点击，只保留了pre::before的点击
	 */
	if (event.target.tagName === 'PRE') {
		const code = event.target.innerText;
		await navigator.clipboard.writeText(code);
		showMsg('代码已复制');
	} else if (event.target.tagName === 'IMG') {
		//拿到图片的src
		const src = event.target.src;
		// 如果class名为user-avatar，直接展示
		if (event.target.className === 'user-avatar') {
			showImg(src);
			return;
		}
		const uploadImg = strHandler('postImg', src);
		showImg(uploadImg);
	}
};

onMounted(async () => {
	try {
		const ID = Number(route.params.id);
		const curPost = await getPostByID(ID, userInfo.value.phone);
		post.value = curPost;
		await getCommentList();
	} catch (e) {
		showMsg(`获取帖子失败: ${e}`);
	}
});
</script>
<style scoped>
.root {
	color: var(--color-text);
	display: flex;
	flex-direction: column;
	padding: 1%;
	width: 100%;
}

.comment {
	width: 100%;
	margin-top: 20px;
	height: auto;
}

.commentList {
	min-width: 100%;
	width: 100%;
}

.subCommentList {
	margin-left: 3%;
}
</style>
