package com.ssafy.controller;

import java.util.HashMap;

import org.jsoup.Jsoup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import com.ssafy.model.dto.Board;
import com.ssafy.model.dto.News;
import com.ssafy.model.dto.NewsDetail;
import com.ssafy.model.dto.RssItem;
import com.ssafy.model.dto.User;
import com.ssafy.model.response.BasicResponse;
import com.ssafy.model.service.NewsService;

@Controller
public class NewsController {

	@Autowired
	private NewsService newsService;
	@Autowired
	private RedisTemplate<String, Object> redisTemplate;

	@PostMapping(value = "/api/news/save")
	public Object saveNews(@RequestHeader("Authorization") String jwtToken, @RequestParam("boardId") long boardId,
			@RequestBody RssItem rssitem) {
		ResponseEntity response = null;
		BasicResponse result = new BasicResponse();

		User user = (User) redisTemplate.opsForValue().get(jwtToken);
		if (user == null) {
			result.status = false;
			result.message = "잘못된 사용자 입니다.";
			response = new ResponseEntity<>(result, HttpStatus.OK);
			return response;
		}

		if (rssitem.getTitle() == null || rssitem.getLink() == null || rssitem.getPubDate() == null
				|| rssitem.getDescription() == null) {
			result.status = false;
			result.message = "필수 값을 입력하세요";
			response = new ResponseEntity<>(result, HttpStatus.OK);
			return response;
		}

		News newsDto = new News();
		newsDto.setNewsTitle(rssitem.getTitle());
		newsDto.setNewsLink(rssitem.getLink());
		newsDto.setNewsImg(rssitem.getImgsrc());

		String summary = Jsoup.parse(rssitem.getDescription()).text();

		if (summary.length() > 100) {
			summary = summary.substring(0, 100);
		}

		newsDto.setNewsDescription(summary);
		newsDto.setNewsDate(rssitem.getPubDate());
		newsDto.setBoardId(boardId);
		newsDto.setUserNo(user.getUserNo());

		HashMap<String, String> detail = (HashMap<String, String>) redisTemplate.opsForValue()
				.get(rssitem.getRssTitle());
		String tag = detail.get(rssitem.getLink());

		NewsDetail newsDetail = new NewsDetail();
		newsDetail.setId(rssitem.getLink());
		newsDetail.setContent(tag);

		result = newsService.saveNews(user, newsDto, newsDetail);

		if (result.status) {
			response = new ResponseEntity(result, HttpStatus.OK);
		} else {
			response = new ResponseEntity(result, HttpStatus.BAD_REQUEST);
		}

		return response;

	}

	@DeleteMapping(value = "/api/news/delete")
	public Object deleteNews(@RequestHeader("Authorization") String jwtToken, @RequestParam("newsId") long newsId) {
		ResponseEntity response = null;
		BasicResponse result = new BasicResponse();

		User user = (User) redisTemplate.opsForValue().get(jwtToken);
		if (user == null) {
			result.status = false;
			result.message = "잘못된 사용자 입니다.";
			response = new ResponseEntity<>(result, HttpStatus.OK);
			return response;
		}

		News news = new News();
		news.setNewsId(newsId);

		result = newsService.deleteNews(user, news);

		if (result.status) {
			response = new ResponseEntity(result, HttpStatus.OK);
		} else {
			response = new ResponseEntity(result, HttpStatus.BAD_REQUEST);
		}

		return response;

	}

	@GetMapping(value = "/api/news/find/all")
	public Object findAllNews(@RequestHeader("Authorization") String jwtToken) {
		ResponseEntity response = null;
		BasicResponse result = new BasicResponse();

		User user = (User) redisTemplate.opsForValue().get(jwtToken);
		if (user == null) {
			result.status = false;
			result.message = "잘못된 사용자 입니다.";
			response = new ResponseEntity<>(result, HttpStatus.OK);
			return response;
		}

		result = newsService.findAllNews(user);

		if (result.status) {
			response = new ResponseEntity(result, HttpStatus.OK);
		} else {
			response = new ResponseEntity(result, HttpStatus.BAD_REQUEST);
		}

		return response;
	}

	@GetMapping(value = "/api/news/find/board")
	public Object findAllByBoard(@RequestHeader("Authorization") String jwtToken,
			@RequestParam("boardId") long boardId) {
		ResponseEntity response = null;
		BasicResponse result = new BasicResponse();

		User user = (User) redisTemplate.opsForValue().get(jwtToken);
		if (user == null) {
			result.status = false;
			result.message = "잘못된 사용자 입니다.";
			response = new ResponseEntity<>(result, HttpStatus.OK);
			return response;
		}

		Board board = new Board();
		board.setBoardId(boardId);

		result = newsService.findAllByBoardId(user, board);

		if (result.status) {
			response = new ResponseEntity(result, HttpStatus.OK);
		} else {
			response = new ResponseEntity(result, HttpStatus.BAD_REQUEST);
		}

		return response;

	}

	@GetMapping(value = "/api/news/find/id")
	public Object findOneById(@RequestHeader("Authorization") String jwtToken, @RequestParam("newsId") long newsId) {
		ResponseEntity response = null;
		BasicResponse result = new BasicResponse();

		User user = (User) redisTemplate.opsForValue().get(jwtToken);
		if (user == null) {
			result.status = false;
			result.message = "잘못된 사용자 입니다.";
			response = new ResponseEntity<>(result, HttpStatus.OK);
			return response;
		}

		News news = new News();
		news.setNewsId(newsId);

		result = newsService.findOneById(user, news);
		if (result.status) {
			response = new ResponseEntity(result, HttpStatus.OK);
		} else {
			response = new ResponseEntity(result, HttpStatus.BAD_REQUEST);
		}

		return response;

	}

	@PostMapping("/api/find/news/detail")
	public Object findNewsHtml(@RequestHeader("Authorization") String jwtToken, @RequestBody RssItem rssItem) {
		ResponseEntity response = null;
		BasicResponse result = new BasicResponse();

		User user = (User) redisTemplate.opsForValue().get(jwtToken);
		if (user == null) {
			result.status = false;
			result.message = "잘못된 사용자 입니다.";
			response = new ResponseEntity<>(result, HttpStatus.OK);
			return response;
		}

		HashMap<String, String> detail = (HashMap<String, String>) redisTemplate.opsForValue()
				.get(rssItem.getRssTitle());
		String tag = detail.get(rssItem.getLink());

		rssItem.setDescription(tag);

		result.data = rssItem;
		result.status = (result.data != null) ? true : false;
		if (result.status) {
			response = new ResponseEntity(result, HttpStatus.OK);
		} else {
			response = new ResponseEntity(result, HttpStatus.BAD_REQUEST);
		}

		return response;
	}
}
