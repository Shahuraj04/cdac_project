package com.proj.service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proj.dto.ChatMessageDTO;
import com.proj.dto.ConversationDTO;
import com.proj.dto.UserSummaryDTO;
import com.proj.entity.ChatMessage;
import com.proj.entity.Employee;
import com.proj.entity.Hr;
import com.proj.entity.User;
import com.proj.repository.ChatMessageRepository;
import com.proj.repository.EmpRepository;
import com.proj.repository.HrRepository;
import com.proj.repository.UserRepository;

@Service
@Transactional
public class ChatService {
    
    @Autowired
    private ChatMessageRepository chatMessageRepository;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EmpRepository empRepository;
    
    @Autowired
    private HrRepository hrRepository;
    
    public ChatMessageDTO saveAndSendMessage(ChatMessageDTO messageDTO) {
        ChatMessage message = ChatMessage.builder()
                .senderId(messageDTO.getSenderId())
                .recipientId(messageDTO.getRecipientId())
                .content(messageDTO.getContent())
                .messageType(messageDTO.getMessageType())
                .isRead(false)
                .build();
        
        ChatMessage savedMessage = chatMessageRepository.save(message);
        
        ChatMessageDTO responseDTO = convertToDTO(savedMessage);
        
        // Send to recipient's private queue
        messagingTemplate.convertAndSendToUser(
            messageDTO.getRecipientId(), 
            "/queue/messages", 
            responseDTO
        );
        
        return responseDTO;
    }
    
    public List<ChatMessageDTO> getConversationHistory(String userId1, String userId2) {
        return chatMessageRepository.findConversation(userId1, userId2)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public void markMessagesAsRead(String recipientId, String senderId) {
        chatMessageRepository.markMessagesAsRead(recipientId, senderId);
    }
    
    public long getUnreadCount(String userId) {
        return chatMessageRepository.countByRecipientIdAndIsReadFalse(userId);
    }
    
    public List<ConversationDTO> getRecentConversations(String userId) {
        List<ChatMessage> messages = chatMessageRepository.findRecentMessages(userId);
        
        Map<String, ChatMessage> latestMessages = new LinkedHashMap<>();
        for (ChatMessage msg : messages) {
            String otherId = msg.getSenderId().equals(userId) ? msg.getRecipientId() : msg.getSenderId();
            latestMessages.putIfAbsent(otherId, msg);
        }
        
        return latestMessages.entrySet().stream().map(entry -> {
            String otherId = entry.getKey();
            ChatMessage lastMsg = entry.getValue();
            
            return ConversationDTO.builder()
                    .userId(otherId)
                    .userName(getUserName(otherId))
                    .lastMessage(lastMsg.getContent())
                    .lastMessageTime(lastMsg.getTimestamp())
                    .unreadCount(chatMessageRepository.findConversation(userId, otherId).stream()
                            .filter(m -> m.getRecipientId().equals(userId) && !m.isRead())
                            .count())
                    .build();
        }).collect(Collectors.toList());
    }
    
    public List<UserSummaryDTO> searchUsers(String query, String currentUserId) {
        List<UserSummaryDTO> results = new ArrayList<>();
        Long currentId = Long.parseLong(currentUserId);
        
        // Search in Employees
        List<Employee> employees = empRepository.findAll();
        for (Employee emp : employees) {
            if (emp.getUser().getId().equals(currentId)) continue;
            if (emp.getEmp_name().toLowerCase().contains(query.toLowerCase()) || 
                emp.getUser().getEmail().toLowerCase().contains(query.toLowerCase())) {
                results.add(UserSummaryDTO.builder()
                        .userId(emp.getUser().getId().toString())
                        .userName(emp.getEmp_name())
                        .email(emp.getUser().getEmail())
                        .role("EMPLOYEE")
                        .build());
            }
        }
        
        // Search in HR
        List<Hr> hrs = hrRepository.findAll();
        for (Hr hr : hrs) {
            if (hr.getUser().getId().equals(currentId)) continue;
            if (hr.getHr_name().toLowerCase().contains(query.toLowerCase()) || 
                hr.getUser().getEmail().toLowerCase().contains(query.toLowerCase())) {
                results.add(UserSummaryDTO.builder()
                        .userId(hr.getUser().getId().toString())
                        .userName(hr.getHr_name())
                        .email(hr.getUser().getEmail())
                        .role("HR")
                        .build());
            }
        }
        
        return results;
    }

    public List<UserSummaryDTO> getChatSuggestions(String userIdStr) {
        List<UserSummaryDTO> suggestions = new ArrayList<>();
        try {
            Long userId = Long.parseLong(userIdStr);
            System.out.println("Fetching suggestions for User ID: " + userId);
            
            User user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                System.out.println("User not found: " + userId);
                return suggestions;
            }

            // If user is Employee
            Employee emp = empRepository.findByUser_Id(userId).orElse(null);
            if (emp != null) {
                System.out.println("User is Employee: " + emp.getEmp_name());
                // 1. Suggest their assigned HR
                Hr assignedHr = emp.getHr();
                if (assignedHr != null) {
                    suggestions.add(UserSummaryDTO.builder()
                            .userId(assignedHr.getUser().getId().toString())
                            .userName(assignedHr.getHr_name() + " (Your HR)")
                            .email(assignedHr.getUser().getEmail())
                            .role("HR")
                            .build());
                    
                    // 2. Suggest teammates (same HR)
                    List<Employee> teammates = empRepository.findByHr_HrId(assignedHr.getHrId());
                    for (Employee teammate : teammates) {
                        if (!teammate.getEmpId().equals(emp.getEmpId())) {
                            suggestions.add(UserSummaryDTO.builder()
                                    .userId(teammate.getUser().getId().toString())
                                    .userName(teammate.getEmp_name())
                                    .email(teammate.getUser().getEmail())
                                    .role("TEAMMATE")
                                    .build());
                        }
                    }
                } else {
                    // Fallback: Suggest all HRs if none assigned
                    System.out.println("No HR assigned to employee, suggesting all HRs");
                    List<Hr> allHrs = hrRepository.findAll();
                    for (Hr h : allHrs) {
                        suggestions.add(UserSummaryDTO.builder()
                                .userId(h.getUser().getId().toString())
                                .userName(h.getHr_name() + " (HR)")
                                .email(h.getUser().getEmail())
                                .role("HR")
                                .build());
                    }
                }
            }

            // If user is HR
            Hr hr = hrRepository.findByUser_Id(userId).orElse(null);
            if (hr != null) {
                System.out.println("User is HR: " + hr.getHr_name());
                // Suggest employees in their department
                if (hr.getDepartment() != null) {
                    List<Employee> deptEmps = empRepository.findByDepartment_DeptId(hr.getDepartment().getDeptId());
                    for (Employee e : deptEmps) {
                        suggestions.add(UserSummaryDTO.builder()
                                .userId(e.getUser().getId().toString())
                                .userName(e.getEmp_name())
                                .email(e.getUser().getEmail())
                                .role("EMPLOYEE")
                                .build());
                    }
                } else {
                    // Fallback: Suggest some employees if no department
                    System.out.println("HR has no department, suggesting all employees");
                    List<Employee> allEmps = empRepository.findAll();
                    for (Employee e : allEmps) {
                        suggestions.add(UserSummaryDTO.builder()
                                .userId(e.getUser().getId().toString())
                                .userName(e.getEmp_name())
                                .email(e.getUser().getEmail())
                                .role("EMPLOYEE")
                                .build());
                    }
                }
            }

        } catch (Exception e) {
            System.err.println("Error in getChatSuggestions: " + e.getMessage());
            e.printStackTrace();
        }
        System.out.println("Returning " + suggestions.size() + " suggestions");
        return suggestions;
    }
    
    private String getUserName(String userIdStr) {
        try {
            Long userId = Long.parseLong(userIdStr);
            // Check if Employee
            Employee emp = empRepository.findByUser_Id(userId).orElse(null);
            if (emp != null) return emp.getEmp_name();
            
            // Check if HR
            Hr hr = hrRepository.findByUser_Id(userId).orElse(null);
            if (hr != null) return hr.getHr_name();
            
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) return user.getEmail();
        } catch (Exception e) {
            // ignore
        }
        return "Unknown User (" + userIdStr + ")";
    }
    
    private ChatMessageDTO convertToDTO(ChatMessage message) {
        return ChatMessageDTO.builder()
                .id(message.getId())
                .senderId(message.getSenderId())
                .senderName(getUserName(message.getSenderId()))
                .recipientId(message.getRecipientId())
                .recipientName(getUserName(message.getRecipientId()))
                .content(message.getContent())
                .messageType(message.getMessageType())
                .timestamp(message.getTimestamp())
                .isRead(message.isRead())
                .build();
    }
}
