package com.morganizer.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.morganizer.dto.CalendarRequest;
import com.morganizer.dto.CalendarResponse;
import com.morganizer.entity.CalendarEntity;
import com.morganizer.entity.UserDetailsEntity;
import com.morganizer.repository.CalendarRepository;
import com.morganizer.repository.UserDetailsRepository;

@Service
public class CalendarService {

	@Autowired
	public CalendarRepository calendarRepository;

	@Autowired
	public UserDetailsRepository userRepo;
	
	@Autowired 
	public EventService eventService;

	public List<CalendarResponse> fetchAll(Long userId) {
		List<CalendarEntity> calendarList = calendarRepository.findByUserId(userId);

		List<CalendarResponse> result = new ArrayList<>();
		for (CalendarEntity calendar : calendarList) {
			result.add(new CalendarResponse(calendar.getCalendarId(), calendar.getName(), calendar.getColor(),
					calendar.getUser().getId(), calendar.isSelected()));
		}
		return result;
	}

	public List<CalendarResponse> saveCalendar(CalendarRequest calendarRequest) {
		UserDetailsEntity user = userRepo.getOne(calendarRequest.getUserId());
		CalendarEntity calendar = new CalendarEntity(calendarRequest.getName(), calendarRequest.getColor(), calendarRequest.isSelected(), user);

		if (calendarRequest.getCalendarId() != 0) {
			calendar.setCalendarId(calendarRequest.getCalendarId());
		}
		calendarRepository.save(calendar);
		calendarRequest.setCalendarId(calendar.getCalendarId());
		return fetchAll(calendarRequest.getUserId());

	}

	/**
	 * This method will first delete all the associated events and then the given calendar
	 * @param calendarId - id of the calendar to be deleted
	 */
	public void deleteCalendar(Long calendarId) {
		try {
			this.eventService.deleteEventByCalendarId(calendarId);
			calendarRepository.deleteById(calendarId);
		} catch (Exception ex) {
			ex.printStackTrace();
			// throw custom exception for no such event present to be deleted
		}

		
	}

}
