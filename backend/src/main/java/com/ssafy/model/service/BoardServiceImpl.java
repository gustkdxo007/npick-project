package com.ssafy.model.service;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ssafy.model.dto.Board;
import com.ssafy.model.dto.News;
import com.ssafy.model.dto.RssItem;
import com.ssafy.model.dto.User;
import com.ssafy.model.repository.BoardRepository;
import com.ssafy.model.repository.NewsRepository;
import com.ssafy.model.response.BasicResponse;

@Service
public class BoardServiceImpl implements BoardService {
	@Autowired
	private BoardRepository boardRepository;
	@Autowired
	private NewsRepository newsRepository;

	@Override
	@Transactional
	public BasicResponse svaeBoard(User user, Board board) {
		// TODO Auto-generated method stub
		BasicResponse result = new BasicResponse();

		if (boardRepository.findOneByBoardNameAndUserNo(board.getBoardName(), user.getUserNo()) != null) {
			result.message = "중복된 보드 이름입니다.";
			result.status = false;
			return result;
		}

		result.data = boardRepository.save(board);
		result.status = (result.data != null) ? true : false;
		if (result.status) {
			result.message = "보드 저장에 성공하였습니다.";
		} else {
			result.message = "보드 저장에 실패하였습니다.";
		}

		return result;
	}

	@Override
	@Transactional
	public BasicResponse findAllBoard(User user) {
		// TODO Auto-generated method stub
		BasicResponse result = new BasicResponse();

		List<Board> boardlist = boardRepository.findAllByUserNo(user.getUserNo());

		for (Board boardData : boardlist) {
			Collections.sort(boardData.getNewsList(), new Comparator<News>() {
				@Override
				public int compare(News o1, News o2) {
					// TODO Auto-generated method stub
					return o2.getNewsDate().compareTo(o1.getNewsDate());
				}
			});
		}

		result.data = boardlist;
		result.status = (result.data != null) ? true : false;
		if (result.status) {
			result.message = "보드 조회에 성공하였습니다.";
		} else {
			result.message = "보드 조회에 실패하였습니다.";
		}

		return result;
	}

	@Override
	@Transactional
	public BasicResponse findOneBoard(User user, Board board) {
		// TODO Auto-generated method stub
		BasicResponse result = new BasicResponse();

		Board boardData = boardRepository.findOneByBoardId(board.getBoardId());

		if (boardData != null)
			Collections.sort(boardData.getNewsList(), new Comparator<News>() {
				@Override
				public int compare(News o1, News o2) {
					// TODO Auto-generated method stub
					return o2.getNewsDate().compareTo(o1.getNewsDate());
				}
			});

		result.data = boardData;
		result.status = (result.data != null) ? true : false;
		if (result.status) {
			result.message = "보드 조회에 성공하였습니다.";
		} else {
			result.message = "보드 조회에 실패하였습니다.";
		}

		return result;
	}

	@Override
	@Transactional
	public BasicResponse updateBoard(User user, Board board) {
		// TODO Auto-generated method stub
		BasicResponse result = new BasicResponse();

		Board checkBoard = boardRepository.findOneByBoardId(board.getBoardId());

		if (checkBoard.getUserNo() != user.getUserNo()) {
			result.status = false;
			result.message = "보드 정보가 일치하지 않습니다.";
			return result;
		}

		checkBoard.setBoardName(board.getBoardName());
		result.data = boardRepository.save(checkBoard);
		result.status = (result.data != null) ? true : false;
		if (result.status) {
			result.message = "보드 수정에 성공하였습니다.";
		} else {
			result.message = "보드 수정에 실패하였습니다.";
		}

		return result;
	}

	@Override
	@Transactional
	public BasicResponse deleteBoard(User user, Board board) {
		// TODO Auto-generated method stub
		BasicResponse result = new BasicResponse();

		if (user == null) {
			result.message = "잘못된 사용자 정보입니다.";
			result.status = false;
			return result;
		}

		board = boardRepository.findOneByBoardId(board.getBoardId());

		if (board.getUserNo() != user.getUserNo()) {
			result.status = false;
			result.message = "보드 정보가 일치하지 않습니다.";
			return result;
		}

		newsRepository.deleteNews(board.getBoardId());
		boardRepository.deleteById(board.getBoardId());

		result.status = true;
		if (result.status) {
			result.message = "보드 삭제에 성공하였습니다.";
		} else {
			result.message = "보드 삭제에 실패하였습니다.";
		}

		return result;
	}

	@Override
	public BasicResponse copyNews(News news) {
		// TODO Auto-generated method stub

		BasicResponse result = new BasicResponse();

		result.data = newsRepository.save(news);

		result.status = true;
		if (result.status) {
			result.message = "뉴스 이동에 성공하였습니다.";
		} else {
			result.message = "뉴스 이동에 실패하였습니다.";
		}

		return result;
	}

}
