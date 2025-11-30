package zotte.dingen.cqrs.conversation;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
class ConversationValidator {

    boolean validate(Conversation conversation) {
        List<Line> lines = new ArrayList<>();
        lines.addAll(conversation.getLines());
        return validateLines(lines);
    }

    private boolean validateLines(List<Line> lines) {
        return lines.stream().allMatch(Line::isValid);
    }
}
