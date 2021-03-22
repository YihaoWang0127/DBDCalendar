package com.morganizer.entity;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;

@Entity(name = "events")
public class EventDetailsEntity {
	
	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name = "event_id")
	private long id;
	
	@ManyToOne
	@JoinColumn(name = "user_id", referencedColumnName = "user_id")
	private UserDetailsEntity user;
	
	private String eventTitle;
	private String eventDescription;
	private Timestamp startTime;
	private Timestamp endTime;
	
	@ManyToOne
	@JoinColumn(name = "mode_id", referencedColumnName = "mode_id")
	private RecurringModeEntity recurringMode;
	
	private String location;

	@ManyToMany
	@JoinColumn(name = "assignee", referencedColumnName = "profile_id")
	private List<ProfileEntity> assigneeList = new ArrayList<>();
	
	private Timestamp lastUpdatedOn;
	
	private String color;
	
	@ManyToMany
	@JoinColumn(name = "reminder", referencedColumnName = "reminder_id")
	private List<EventReminderEntity> reminderList = new ArrayList<>();
	
	public EventDetailsEntity() {
		
	}
	

	public EventDetailsEntity(UserDetailsEntity user, String eventTitle, String eventDescription, Timestamp startTime,
			Timestamp endTime, RecurringModeEntity recurringMode, String location, List<ProfileEntity> assigneeList,
			Timestamp lastUpdatedOn, String color, List<EventReminderEntity> reminderList) {
		super();
		this.user = user;
		this.eventTitle = eventTitle;
		this.eventDescription = eventDescription;
		this.startTime = startTime;
		this.endTime = endTime;
		this.recurringMode = recurringMode;
		this.location = location;
		this.assigneeList = assigneeList;
		this.lastUpdatedOn = lastUpdatedOn;
		this.color = color;
		this.reminderList = reminderList;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public UserDetailsEntity getUser() {
		return user;
	}

	public void setUser(UserDetailsEntity user) {
		this.user = user;
	}

	public String getEventTitle() {
		return eventTitle;
	}

	public void setEventTitle(String eventTitle) {
		this.eventTitle = eventTitle;
	}

	public String getEventDescription() {
		return eventDescription;
	}

	public void setEventDescription(String eventDescription) {
		this.eventDescription = eventDescription;
	}

	public Timestamp getStartTime() {
		return startTime;
	}

	public void setStartTime(Timestamp startTime) {
		this.startTime = startTime;
	}

	public Timestamp getEndTime() {
		return endTime;
	}

	public void setEndTime(Timestamp endTime) {
		this.endTime = endTime;
	}

	public RecurringModeEntity getRecurringMode() {
		return recurringMode;
	}

	public void setRecurringMode(RecurringModeEntity recurringMode) {
		this.recurringMode = recurringMode;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}	
	

	public Timestamp getLastUpdatedOn() {
		return lastUpdatedOn;
	}

	public void setLastUpdatedOn(Timestamp lastUpdatedOn) {
		this.lastUpdatedOn = lastUpdatedOn;
	}


	public String getColor() {
		return color;
	}


	public void setColor(String color) {
		this.color = color;
	}


	public List<ProfileEntity> getAssigneeList() {
		return assigneeList;
	}


	public void setAssigneeList(List<ProfileEntity> assigneeList) {
		this.assigneeList = assigneeList;
	}

	public List<EventReminderEntity> getReminderList() {
		return reminderList;
	}

	public void setReminderList(List<EventReminderEntity> reminderList) {
		this.reminderList = reminderList;
	}
	
}
